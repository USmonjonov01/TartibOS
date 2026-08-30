import { useCallback, useEffect, useMemo, useState } from "react";
import { Star, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { authApi, routineApi } from "../../axios";
import { getTodayHabits, habitKey } from "../../utils/routine";
import { getDayKey, getISOWeekId } from "../../utils/date";
import {
    Screen,
    CenterScreen,
    Logo,
    Header,
    Greeting,
    DateLine,
    ProgressCard,
    ProgressTrack,
    ProgressFill,
    ProgressLabel,
    List,
    HabitCard,
    HabitTop,
    HabitEmoji,
    HabitBody,
    HabitTitle,
    HabitPlan,
    HabitTime,
    ActionRow,
    ActionBtn,
    StarsRow,
    StarBtn,
    ReasonInput,
    SaveReasonBtn,
    EmptyState,
    StatusText,
    LoginCard,
    LoginTitle,
    LoginSub,
    FieldLabel,
    Input,
    SubmitBtn,
    ErrorText,
    ChangeLink,
    StatusBadge,
    NoteText,
    colors,
} from "./style";

// SDK endi index.html'da statik <script> sifatida, bizning modulimizdan
// OLDIN yuklanadi — shuning uchun bu deyarli har doim darhol tayyor bo'ladi.
// Juda sekin tarmoqlar uchun bir necha marta qayta tekshiramiz, xolos.
const waitForTelegramWebApp = (retries = 20, delayMs = 100) =>
    new Promise((resolve) => {
        const check = (n) => {
            if (window.Telegram?.WebApp) {
                resolve(window.Telegram.WebApp);
                return;
            }
            if (n <= 0) {
                resolve(null);
                return;
            }
            setTimeout(() => check(n - 1), delayMs);
        };
        check(retries);
    });

const STATUS_META = {
    done: { label: "Bajarildi", color: colors.success, bg: colors.successLight, icon: CheckCircle2 },
    missed: { label: "Bajarilmadi", color: colors.danger, bg: colors.dangerLight, icon: XCircle },
    excused: { label: "Sababli", color: colors.warning, bg: colors.primaryLight, icon: AlertCircle },
};

const TelegramApp = () => {
    const [phase, setPhase] = useState("loading"); // loading | login | app | error
    const [initData, setInitData] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const [email, setEmail] = useState("");
    const [parol, setParol] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);

    const [userName, setUserName] = useState("");
    const [routines, setRoutines] = useState([]);
    const [week, setWeek] = useState(null);
    const [dataLoading, setDataLoading] = useState(false);

    const [openKey, setOpenKey] = useState(null); // qaysi odat kartasi "tahrirlash" holatida
    const [openMode, setOpenMode] = useState(null); // "stars" | "reason"
    const [reasonDraft, setReasonDraft] = useState("");
    const [saving, setSaving] = useState(false);

    // 1-qadam: Telegram SDK yuklanadi, initData olinadi, backend orqali tekshiriladi
    useEffect(() => {
        let cancelled = false;

        const boot = async () => {
            try {
                const tg = await waitForTelegramWebApp();
                if (cancelled) return;

                if (!tg || !tg.initData) {
                    setErrorMsg("Bu sahifa faqat Telegram ilovasi ichida ishlaydi.");
                    setPhase("error");
                    return;
                }

                // Iloji boricha tezroq — Telegram'ga ilova tayyor ekanini bildiradi
                tg.ready();
                tg.expand();
                try {
                    tg.setHeaderColor?.("#0E141F");
                    tg.setBackgroundColor?.("#0E141F");
                    tg.disableVerticalSwipes?.();
                } catch {
                    // Eski Telegram versiyalarida bu metodlar bo'lmasligi mumkin — muhim emas
                }

                const data = tg.initData;
                setInitData(data);

                const { data: res } = await authApi.post("/telegram/mini-app-auth", { initData: data });
                if (cancelled) return;

                if (res.linked) {
                    localStorage.setItem("token", res.token);
                    setUserName(res.user?.ism || "");
                    setPhase("app");
                } else {
                    setPhase("login");
                }
            } catch {
                if (!cancelled) {
                    setErrorMsg("Ulanishda xatolik yuz berdi. Qayta urinib ko'ring.");
                    setPhase("error");
                }
            }
        };

        boot();
        return () => {
            cancelled = true;
        };
    }, []);

    // 2-qadam: autentifikatsiyadan so'ng bugungi ma'lumotlarni yuklaydi
    const loadData = useCallback(async () => {
        setDataLoading(true);
        try {
            const [{ data: routinesData }, { data: weeksData }] = await Promise.all([
                routineApi.get("/routines"),
                routineApi.get("/weeks"),
            ]);
            setRoutines(routinesData.routines || routinesData || []);
            const weekId = getISOWeekId();
            const list = weeksData.weeks || weeksData || [];
            setWeek(list.find((w) => w.weekId === weekId) || null);
        } finally {
            setDataLoading(false);
        }
    }, []);

    useEffect(() => {
        if (phase === "app") {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- autentifikatsiyadan so'ng bir martalik ma'lumot yuklash, standart pattern
            loadData();
        }
    }, [phase, loadData]);

    // Birinchi marta ochilganda: oddiy email/parol bilan kirib, shu Telegram
    // hisobini ushbu foydalanuvchiga bog'laydi
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError(null);
        try {
            const { data } = await authApi.post("/auth/login", { email, parol });
            localStorage.setItem("token", data.token);
            setUserName(data.user?.ism || "");
            await authApi.post("/telegram/link-via-miniapp", { initData });
            setPhase("app");
        } catch (err) {
            setLoginError(err.response?.data?.message || "Email yoki parol noto'g'ri");
        } finally {
            setLoginLoading(false);
        }
    };

    const dayKey = getDayKey();
    const todayHabits = useMemo(() => getTodayHabits(routines), [routines]);
    const doneKeys = useMemo(() => new Set(week?.completions?.[dayKey] || []), [week, dayKey]);
    const reasonsToday = useMemo(() => week?.reasons?.[dayKey] || {}, [week, dayKey]);
    const scoresToday = useMemo(() => week?.scores?.[dayKey] || {}, [week, dayKey]);

    const getState = useCallback(
        (habit) => {
            const key = habitKey(habit);
            if (doneKeys.has(key)) return "done";
            const entry = reasonsToday[key];
            const status = typeof entry === "string" ? entry : entry?.status;
            if (status === "excused") return "excused";
            if (status === "missed") return "missed";
            return null;
        },
        [doneKeys, reasonsToday]
    );

    const doneCount = todayHabits.filter((h) => getState(h) === "done").length;
    const pct = todayHabits.length > 0 ? Math.round((doneCount / todayHabits.length) * 100) : 0;

    // Dashboard'dagi applyHabitStateChange bilan bir xil mantiq — bir xil
    // /weeks/day endpoint'iga yozadi, shuning uchun saytda ham darhol ko'rinadi
    const saveState = async (habit, newState, extra = {}) => {
        const key = habitKey(habit);
        setSaving(true);
        try {
            const completions = new Set(week?.completions?.[dayKey] || []);
            if (newState === "done") completions.add(key);
            else completions.delete(key);
            const habitIds = Array.from(completions);

            const dayReasons = { ...(week?.reasons?.[dayKey] || {}) };
            if (newState === "missed") dayReasons[key] = { status: "missed" };
            else if (newState === "excused") dayReasons[key] = { status: "excused", note: extra.note || "" };
            else delete dayReasons[key];
            const nextReasons = { ...(week?.reasons || {}), [dayKey]: dayReasons };

            const dayScores = { ...(week?.scores?.[dayKey] || {}) };
            if (newState === "done" && typeof extra.score === "number") dayScores[key] = extra.score;
            else delete dayScores[key];
            const nextScores = { ...(week?.scores || {}), [dayKey]: dayScores };

            const { data } = await routineApi.put("/weeks/day", {
                weekId: getISOWeekId(),
                dayKey,
                habitIds,
                scores: nextScores,
                reasons: nextReasons,
                totalHabits: todayHabits.length,
            });
            setWeek(data.week);
            setOpenKey(null);
            setOpenMode(null);
            setReasonDraft("");
        } finally {
            setSaving(false);
        }
    };

    if (phase === "loading") {
        return (
            <CenterScreen>
                <Logo>TartibOS</Logo>
                <StatusText>Yuklanmoqda...</StatusText>
            </CenterScreen>
        );
    }

    if (phase === "error") {
        return (
            <CenterScreen>
                <Logo>TartibOS</Logo>
                <StatusText>{errorMsg}</StatusText>
            </CenterScreen>
        );
    }

    if (phase === "login") {
        return (
            <CenterScreen>
                <LoginCard>
                    <Logo style={{ textAlign: "center", marginBottom: 8 }}>TartibOS</Logo>
                    <LoginTitle>Hisobingizni bog'lang</LoginTitle>
                    <LoginSub>Telegram orqali eslatma olish uchun bir marta kiring</LoginSub>
                    <form onSubmit={handleLogin}>
                        <FieldLabel>Email</FieldLabel>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                        <FieldLabel>Parol</FieldLabel>
                        <Input
                            type="password"
                            value={parol}
                            onChange={(e) => setParol(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                        {loginError && <ErrorText>{loginError}</ErrorText>}
                        <SubmitBtn type="submit" $disabled={loginLoading} disabled={loginLoading}>
                            {loginLoading ? "Kirilmoqda..." : "Kirish va bog'lash"}
                        </SubmitBtn>
                    </form>
                </LoginCard>
            </CenterScreen>
        );
    }

    // phase === "app"
    return (
        <Screen>
            <Header>
                <Greeting>Salom{userName ? `, ${userName}` : ""} 👋</Greeting>
                <DateLine>Bugungi odatlaringiz</DateLine>
            </Header>

            {dataLoading ? (
                <StatusText>Yuklanmoqda...</StatusText>
            ) : todayHabits.length === 0 ? (
                <EmptyState>Bugun uchun rejalashtirilgan odat yo'q.</EmptyState>
            ) : (
                <>
                    <ProgressCard>
                        <ProgressTrack>
                            <ProgressFill $pct={pct} />
                        </ProgressTrack>
                        <ProgressLabel>
                            {doneCount}/{todayHabits.length}
                        </ProgressLabel>
                    </ProgressCard>

                    <List>
                        {todayHabits.map((habit) => {
                            const key = habitKey(habit);
                            const state = getState(habit);
                            const isEditing = openKey === key || state === null;
                            const score = scoresToday[key];
                            const note = reasonsToday[key]?.note;
                            const StatusIcon = state ? STATUS_META[state].icon : null;

                            return (
                                <HabitCard key={habit.id} $done={state === "done"}>
                                    <HabitTop>
                                        <HabitEmoji>{habit.icon || "🕒"}</HabitEmoji>
                                        <HabitBody>
                                            <HabitTitle $done={state === "done"}>{habit.title}</HabitTitle>
                                            {habit.dayPlans?.[dayKey] && (
                                                <HabitPlan>— {habit.dayPlans[dayKey]}</HabitPlan>
                                            )}
                                        </HabitBody>
                                        {habit.start && <HabitTime>{habit.start}</HabitTime>}
                                    </HabitTop>

                                    {!isEditing && state && (
                                        <>
                                            <StatusBadge $color={STATUS_META[state].color} $bg={STATUS_META[state].bg}>
                                                <StatusIcon size={13} />
                                                {STATUS_META[state].label}
                                                {state === "done" && score ? ` · ${score}/10` : ""}
                                            </StatusBadge>
                                            {note && <NoteText>"{note}"</NoteText>}
                                            <br />
                                            <ChangeLink
                                                onClick={() => {
                                                    setOpenKey(key);
                                                    setOpenMode(null);
                                                    setReasonDraft(note || "");
                                                }}
                                            >
                                                O'zgartirish
                                            </ChangeLink>
                                        </>
                                    )}

                                    {isEditing && openMode !== "stars" && openMode !== "reason" && (
                                        <ActionRow>
                                            <ActionBtn
                                                type="button"
                                                $active={false}
                                                onClick={() => {
                                                    setOpenKey(key);
                                                    setOpenMode("stars");
                                                }}
                                                disabled={saving}
                                            >
                                                <CheckCircle2 size={15} /> Bajarildi
                                            </ActionBtn>
                                            <ActionBtn
                                                type="button"
                                                $active={false}
                                                onClick={() => saveState(habit, "missed")}
                                                disabled={saving}
                                            >
                                                <XCircle size={15} /> Yo'q
                                            </ActionBtn>
                                            <ActionBtn
                                                type="button"
                                                $active={false}
                                                onClick={() => {
                                                    setOpenKey(key);
                                                    setOpenMode("reason");
                                                }}
                                                disabled={saving}
                                            >
                                                <AlertCircle size={15} /> Sababli
                                            </ActionBtn>
                                        </ActionRow>
                                    )}

                                    {isEditing && openKey === key && openMode === "stars" && (
                                        <StarsRow>
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <StarBtn
                                                    key={i}
                                                    type="button"
                                                    disabled={saving}
                                                    onClick={() => saveState(habit, "done", { score: i * 2 })}
                                                >
                                                    <Star size={26} color={colors.warning} fill="none" strokeWidth={1.5} />
                                                </StarBtn>
                                            ))}
                                        </StarsRow>
                                    )}

                                    {isEditing && openKey === key && openMode === "reason" && (
                                        <>
                                            <ReasonInput
                                                placeholder="Nima uchun bajarilmadi?"
                                                value={reasonDraft}
                                                onChange={(e) => setReasonDraft(e.target.value)}
                                            />
                                            <SaveReasonBtn
                                                type="button"
                                                disabled={saving}
                                                onClick={() => saveState(habit, "excused", { note: reasonDraft })}
                                            >
                                                Saqlash
                                            </SaveReasonBtn>
                                        </>
                                    )}
                                </HabitCard>
                            );
                        })}
                    </List>
                </>
            )}
        </Screen>
    );
};

export default TelegramApp;
