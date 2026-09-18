import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    CheckCircle2,
    Circle,
    XCircle,
    AlertCircle,
    Clock,
    Clock3,
    ArrowRight,
    TrendingUp,
    AlertTriangle,
    Flame,
    Star,
} from "lucide-react";
import { useUser } from "../../context/users";
import { useRoutine } from "../../context/routine";
import { useWeeks } from "../../context/weaks";
import { useNotifications } from "../../context/notifications";
import Loader from "../Loader";
import DayTimeline from "../DayTimeline";
import { missionApi } from "../../axios";
import { getTodayHabits, habitKey } from "../../utils/routine";
import { getDayPct, getWeekAvgPct } from "../../utils/stats";
import { DAY_ORDER, DAY_LABELS_UZ, getDayKey, getDateStr, getISOWeekId } from "../../utils/date";
import {
    Wrapper,
    HeaderBlock,
    DateLabel,
    Greeting,
    TopGrid,
    DisciplineCardWrap,
    DisciplineLabel,
    DisciplineValue,
    DisciplineSub,
    StatCardWrap,
    StatHead,
    StatLabel,
    StatIconBox,
    StatValue,
    StatSub,
    MainGrid,
    Col,
    SectionCard,
    SectionHeader,
    SectionTitle,
    SectionSubtitle,
    CountBadge,
    SectionBody,
    Row,
    RowEmoji,
    RowBody,
    RowTitle,
    RowNote,
    TodayPlanSpan,
    RowMeta,
    PriorityDot,
    TimeTag,
    EmptyState,
    EmptyIcon,
    EmptyTitle,
    EmptySub,
    WeeklyHeader,
    WeeklyTitle,
    LegendRow,
    LegendItem,
    LegendDot,
    ChartRow,
    ChartCol,
    BarTrack,
    Bar,
    DayTag,
    InsightBox,
    InsightHead,
    InsightLabel,
    InsightText,
    InsightLink,
    ErrorBanner,
    HabitLegendRow,
    HabitLegendItem,
    HabitLegendDot,
    ModalOverlay,
    ModalBox,
    ModalTitle,
    ModalSubtitle,
    ModalTextarea,
    ModalActions,
    ModalBtn,
    RatingStarsRow,
    RatingStarBtn,
    RatingHint,
    ScoreStarsRow,
    InsightActionBtn,
    colors,
} from "./style";
import { tokens } from "../../theme/tokens";
import GoalStatsRow from "./GoalStatsRow";


const PRIORITY_COLORS = {
    yuqori: colors.danger,
    ortacha: colors.warning,
    past: colors.success,
};

const priorityColor = (priority) => PRIORITY_COLORS[priority] || colors.textSubtle;

// Holat tsikli: null -> "done" -> "missed" -> "excused" -> null
// (History sahifasi bilan bir xil mantiq — bitta joyda ikkita xil qoida bo'lmasin)
const nextHabitState = (current) => {
    if (!current) return "done";
    if (current === "done") return "missed";
    if (current === "missed") return "excused";
    return null;
};

const habitStateIcon = (state) => {
    if (state === "done") return <CheckCircle2 size={20} color={colors.success} strokeWidth={2} />;
    if (state === "missed") return <XCircle size={20} color={colors.danger} strokeWidth={2} />;
    if (state === "excused") return <AlertCircle size={20} color={colors.warning} strokeWidth={2} />;
    return <Circle size={20} color={colors.textSubtle} strokeWidth={2} />;
};

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { routines, loading: routineLoading, error: routineError, fetchRoutines } = useRoutine();
    const { weeks, loading: weeksLoading, error: weeksError, fetchWeeks, saveDayCompletion } = useWeeks();
    const { notifyMissionCompleted } = useNotifications();

    const [missions, setMissions] = useState([]);
    const [missionsLoading, setMissionsLoading] = useState(false);
    const [missionsError, setMissionsError] = useState(null);
    const [habitSyncError, setHabitSyncError] = useState(null);
    const [pendingHabitKey, setPendingHabitKey] = useState(null);
    const [reasonModal, setReasonModal] = useState(null); // { habit }
    const [reasonText, setReasonText] = useState("");
    const [ratingModal, setRatingModal] = useState(null); // { habit }
    const [hoverStars, setHoverStars] = useState(0);

    const fetchMissions = useCallback(async () => {
        if (!user) return;
        setMissionsLoading(true);
        setMissionsError(null);
        try {
            const { data } = await missionApi.get("/missions");
            const list = data.missions || data || [];
            setMissions(Array.isArray(list) ? list : []);
        } catch (err) {
            setMissionsError(
                err.response?.data?.message || err.message || "Missiyalarni olishda xatolik"
            );
        } finally {
            setMissionsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;
        fetchRoutines();
        fetchWeeks();
        // eslint-disable-next-line react-hooks/set-state-in-effect -- montaj vaqtida ma'lumot olish, standart pattern
        fetchMissions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const now = useMemo(() => new Date(), []);
    const dayName = now.toLocaleDateString("uz-UZ", { weekday: "long" });
    const dateStr = now.toLocaleDateString("uz-UZ", { day: "numeric", month: "long" });
    const greeting = now.getHours() < 12 ? "Xayrli tong" : now.getHours() < 18 ? "Xayrli kun" : "Xayrli kech";
    const todayDateStr = getDateStr(now);
    const todayKey = useMemo(() => getDayKey(now), [now]);

    const todayHabits = useMemo(() => getTodayHabits(routines, now), [routines, now]);
    // (totalHabitsCount olib tashlandi — endi haftalik % kunlik getDayPct orqali,
    // shu kunga rejalashtirilgan odatlar soniga qarab hisoblanadi)

    const currentWeekId = useMemo(() => getISOWeekId(now), [now]);
    const currentWeek = useMemo(
        () => weeks.find((w) => w.weekId === currentWeekId),
        [weeks, currentWeekId]
    );

    // "Haftalik solishtiruv" widget'i uchun — o'tgan haftaning shu kungacha bo'lgan yozuvi
    const previousWeekId = useMemo(
        () => getISOWeekId(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)),
        [now]
    );
    const previousWeek = useMemo(
        () => weeks.find((w) => w.weekId === previousWeekId),
        [weeks, previousWeekId]
    );
    const currentWeekPct = useMemo(() => getWeekAvgPct(currentWeek, routines), [currentWeek, routines]);
    const previousWeekPct = useMemo(() => getWeekAvgPct(previousWeek, routines), [previousWeek, routines]);

    // "Eng past natijali kun" widget'i uchun — barcha yuklangan haftalar bo'yicha
    // har bir hafta kuni (Du..Ya) uchun o'rtacha % hisoblanadi, eng pasti tanlanadi.
    // Kamida bitta haqiqiy ma'lumot nuqtasi bo'lgan kunlargina hisobga olinadi.
    const weakestDay = useMemo(() => {
        const sums = {};
        const counts = {};
        DAY_ORDER.forEach((dayKey) => {
            weeks.forEach((week) => {
                const pct = getDayPct(routines, week, dayKey);
                if (pct === null) return;
                sums[dayKey] = (sums[dayKey] || 0) + pct;
                counts[dayKey] = (counts[dayKey] || 0) + 1;
            });
        });
        let worstKey = null;
        let worstAvg = Infinity;
        DAY_ORDER.forEach((dayKey, i) => {
            if (!counts[dayKey]) return;
            const avg = Math.round(sums[dayKey] / counts[dayKey]);
            if (avg < worstAvg) {
                worstAvg = avg;
                worstKey = dayKey;
            }
        });
        if (!worstKey) return null;
        return { label: DAY_LABELS_UZ[DAY_ORDER.indexOf(worstKey)], pct: worstAvg };
    }, [weeks, routines]);

    // Ketma-ket bosishlarda ikki marta yangi hafta yozuvi yaratilib qolmasligi
    // uchun so'rovlarni navbatga qo'yamiz va har doim eng so'nggi week holatidan foydalanamiz.
    const currentWeekRef = useRef(currentWeek);
    useEffect(() => {
        currentWeekRef.current = currentWeek;
    }, [currentWeek]);
    const saveQueueRef = useRef(Promise.resolve());

    // MUHIM: holat optimistik lokal Set orqali emas, TO'G'RIDAN-TO'G'RI serverdagi
    // currentWeek'dan hisoblanadi (History sahifasi bilan bir xil mantiq). Avval
    // bu yerda faqat "bajarildi/bajarilmadi" ikkita holat bo'lgan, endi "sababli
    // bajarilmadi" ham qo'shildi — uchta alohida ma'lumot manbai (Set + reason)
    // orasida nomuvofiqlik chiqmasligi uchun eng ishonchli yo'l — bitta joydan
    // (server) o'qish.
    const getHabitState = useCallback(
        (habit) => {
            const key = habitKey(habit);
            const completions = currentWeek?.completions?.[todayKey] || [];
            if (completions.includes(key)) return "done";

            const entry = currentWeek?.reasons?.[todayKey]?.[key];
            const status = typeof entry === "string" ? entry : entry?.status;
            if (status === "excused") return "excused";
            if (status === "missed") return "missed";

            return null;
        },
        [currentWeek, todayKey]
    );

    // Bajarilgan odatning ballini (2/4/6/8/10) qaytaradi, agar baholanmagan bo'lsa null
    const getHabitScore = useCallback(
        (habit) => {
            const key = habitKey(habit);
            const score = currentWeek?.scores?.[todayKey]?.[key];
            return typeof score === "number" ? score : null;
        },
        [currentWeek, todayKey]
    );

    const completedHabits = todayHabits.filter((h) => getHabitState(h) === "done").length;
    const disciplineScore = todayHabits.length > 0
        ? Math.round((completedHabits / todayHabits.length) * 100)
        : 0;

    // MUHIM TUZATISH: avvalgi versiyada diff (habitIds/reasons/scores) CHAQIRISH
    // PAYTIDA, navbatga qo'yishdan OLDIN hisoblanardi. Agar foydalanuvchi ikkita
    // turli odatni tez ketma-ket baholasa (masalan bir nechta yulduzchani birin-
    // ketin bossa), ikkinchisining diff'i BIRINCHISINING natijasi serverga
    // yetib bormasdan turib, ESKI ma'lumotdan hisoblanib qolar edi — va serverga
    // yozilganda birinchi o'zgarishni "yo'qotib qo'yardi" (real xato — reyting
    // yo'qolishi va status almashib qolishi shundan edi).
    //
    // Endi diff FAQAT navbatdagi TASK ichida, aynan shu vazifa bajarilish
    // vaqtida hisoblanadi — shu payt currentWeekRef.current allaqachon oldingi
    // barcha saqlashlarning natijasini o'zida tutadi (har bir saqlash tugashi
    // bilan darhol yangilanadi, React qayta render qilishini kutmasdan).
    //
    // Bundan tashqari, "pendingHabitKey bo'lsa hech narsa qilma" degan eski
    // qoida OLIB TASHLANDI — u boshqa odatni bosishni butunlay e'tiborsiz
    // qoldirar edi (click "yo'qolar" edi, hech qanday xato ko'rsatmasdan).
    // Endi har bir bosish navbatga albatta qo'shiladi, faqat ketma-ket, to'g'ri
    // tartibda bajariladi.
    const applyHabitStateChange = useCallback(
        ({ habit, newState, note, score }) => {
            const key = habitKey(habit);

            setHabitSyncError(null);
            setPendingHabitKey(key);

            const task = () => {
                const existing = new Set(currentWeekRef.current?.completions?.[todayKey] || []);
                if (newState === "done") existing.add(key);
                else existing.delete(key);
                const habitIds = Array.from(existing);

                const currentReasons = currentWeekRef.current?.reasons || {};
                const dayReasons = { ...(currentReasons[todayKey] || {}) };
                if (newState === "missed") {
                    dayReasons[key] = { status: "missed" };
                } else if (newState === "excused") {
                    dayReasons[key] = { status: "excused", note: note || "" };
                } else {
                    delete dayReasons[key];
                }
                const nextReasons = { ...currentReasons, [todayKey]: dayReasons };

                // Ball faqat "bajarildi" holati uchun saqlanadi — boshqa holatlarda tozalanadi
                const currentScores = currentWeekRef.current?.scores || {};
                const dayScores = { ...(currentScores[todayKey] || {}) };
                if (newState === "done" && typeof score === "number") {
                    dayScores[key] = score;
                } else {
                    delete dayScores[key];
                }
                const nextScores = { ...currentScores, [todayKey]: dayScores };

                return saveDayCompletion({
                    week: currentWeekRef.current,
                    weekId: currentWeekId,
                    dayKey: todayKey,
                    habitIds,
                    scores: nextScores,
                    reasons: nextReasons,
                    totalHabits: todayHabits.length,
                })
                    .then((updatedWeek) => {
                        // Navbatdagi keyingi task to'g'ri ma'lumotdan boshlashi uchun,
                        // ref'ni DARHOL (React render kutmasdan) yangilaymiz.
                        if (updatedWeek) currentWeekRef.current = updatedWeek;
                    })
                    .catch((err) => {
                        setHabitSyncError(
                            err.response?.data?.message || err.message || "Odat holatini saqlashda xatolik"
                        );
                    })
                    .finally(() => {
                        setPendingHabitKey((prev) => (prev === key ? null : prev));
                    });
            };

            saveQueueRef.current = saveQueueRef.current.then(task, task);
        },
        [todayKey, currentWeekId, todayHabits.length, saveDayCompletion]
    );

    const handleHabitClick = (habit) => {
        const current = getHabitState(habit);
        const next = nextHabitState(current);
        if (next === "excused") {
            setReasonModal({ habit });
            setReasonText("");
        } else if (next === "done") {
            setRatingModal({ habit });
            setHoverStars(0);
        } else {
            applyHabitStateChange({ habit, newState: next });
        }
    };

    const handleReasonConfirm = () => {
        if (!reasonModal) return;
        applyHabitStateChange({ habit: reasonModal.habit, newState: "excused", note: reasonText });
        setReasonModal(null);
        setReasonText("");
    };

    const handleReasonCancel = () => {
        setReasonModal(null);
        setReasonText("");
    };

    const handleRatingSelect = (stars) => {
        if (!ratingModal) return;
        applyHabitStateChange({ habit: ratingModal.habit, newState: "done", score: stars * 2 });
        setRatingModal(null);
        setHoverStars(0);
    };

    const handleRatingCancel = () => {
        setRatingModal(null);
        setHoverStars(0);
    };

    const todayMissions = useMemo(
        () => missions.filter((m) => !m.__container && m.date === todayDateStr && !m.cancelled),
        [missions, todayDateStr]
    );
    const completedMissions = todayMissions.filter((m) => m.completed).length;

    const timelineItems = useMemo(() => {
        const habitItems = todayHabits
            .filter((h) => h.start)
            .map((h) => ({
                id: `habit-${h.id}`,
                title: h.title,
                icon: h.icon,
                start: h.start,
                end: h.end,
                state: getHabitState(h) || "pending",
                type: "habit",
            }));

        const missionItems = todayMissions
            .filter((m) => m.start)
            .map((m) => ({
                id: `mission-${m.id}`,
                title: m.title,
                icon: "✦",
                start: m.start,
                end: m.end,
                state: m.completed ? "done" : "pending",
                type: "mission",
            }));

        return [...habitItems, ...missionItems];
    }, [todayHabits, todayMissions, getHabitState]);

    // "Navbatdagi ish" widget'i uchun — hozir davom etayotgan (agar bor bo'lsa)
    // yoki eng yaqin kelayotgan bajarilmagan band. Faqat vaqti belgilangan va
    // hali "pending" holatidagi bandlar orasidan tanlanadi.
    const toMin = (hhmm) => {
        if (!hhmm || !hhmm.includes(":")) return null;
        const [h, m] = hhmm.split(":").map(Number);
        return Number.isNaN(h) || Number.isNaN(m) ? null : h * 60 + m;
    };
    const nextUpItem = useMemo(() => {
        const nowMin = now.getHours() * 60 + now.getMinutes();
        const candidates = timelineItems
            .filter((it) => it.state === "pending")
            .map((it) => ({ ...it, startMin: toMin(it.start), endMin: toMin(it.end) }))
            .filter((it) => it.startMin !== null);

        const active = candidates.find(
            (it) => it.startMin <= nowMin && (it.endMin === null || nowMin < it.endMin)
        );
        if (active) return { ...active, isNow: true };

        const upcoming = candidates
            .filter((it) => it.startMin > nowMin)
            .sort((a, b) => a.startMin - b.startMin)[0];
        return upcoming ? { ...upcoming, isNow: false } : null;
    }, [timelineItems, now]);

    const nextUpHabit = useMemo(() => {
        if (!nextUpItem || nextUpItem.type !== "habit") return null;
        const rawId = nextUpItem.id.replace(/^habit-/, "");
        return todayHabits.find((h) => String(h.id) === rawId) || null;
    }, [nextUpItem, todayHabits]);

    const nextUpMission = useMemo(() => {
        if (!nextUpItem || nextUpItem.type !== "mission") return null;
        const rawId = nextUpItem.id.replace(/^mission-/, "");
        return todayMissions.find((m) => String(m.id) === rawId) || null;
    }, [nextUpItem, todayMissions]);

    const toggleMission = async (mission) => {
        const nextCompleted = !mission.completed;
        setMissions((prev) =>
            prev.map((m) => (m.id === mission.id ? { ...m, completed: nextCompleted } : m))
        );
        try {
            await missionApi.put(`/mission/${mission.id}`, { ...mission, completed: nextCompleted });
            if (nextCompleted) notifyMissionCompleted(mission);
        } catch {
            // server bilan sinxronlash muvaffaqiyatsiz bo'lsa, holatni ortga qaytaramiz
            setMissions((prev) =>
                prev.map((m) => (m.id === mission.id ? { ...m, completed: mission.completed } : m))
            );
        }
    };

    const weeklyBars = useMemo(() => {
        return DAY_ORDER.map((dayKey, i) => {
            const executions = currentWeek?.executions?.[dayKey];
            const hasData = executions !== undefined;
            const pct = getDayPct(routines, currentWeek, dayKey);
            return {
                dayKey,
                label: DAY_LABELS_UZ[i],
                pct,
                hasData,
            };
        });
    }, [currentWeek, routines]);

    const trackedDays = weeklyBars.filter((b) => b.hasData);
    const weeklyAvg = trackedDays.length > 0
        ? Math.round(trackedDays.reduce((sum, b) => sum + b.pct, 0) / trackedDays.length)
        : null;

    const streakDays = currentWeek
        ? Object.values(currentWeek.statuses || {}).filter((s) => s === "completed").length
        : 0;
    const streakTotalTracked = currentWeek ? Object.keys(currentWeek.statuses || {}).length : 0;

    // "Streak" endi 100% bajarilgan kunlar soni emas — TartibOS bilan qancha
    // vaqtdan beri (ro'yxatdan o'tgandan buyon) ishlab kelayotgani. Haftaning
    // 7 kunida doim 100% natija ko'rsatib bo'lmaydi, lekin izchil urinish
    // o'zi qadrli — shuni aks ettiradi.
    const tenureDays = useMemo(() => {
        if (!user?.createdAt) return null;
        const created = new Date(user.createdAt);
        if (Number.isNaN(created.getTime())) return null;
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfCreated = new Date(created.getFullYear(), created.getMonth(), created.getDate());
        const diffDays = Math.round((startOfToday - startOfCreated) / 86_400_000) + 1;
        return Math.max(diffDays, 1);
    }, [user, now]);

    const anyLoading = routineLoading || weeksLoading || missionsLoading;
    // Haqiqiy progress — soxta animatsiya emas: 3 ta mustaqil so'rovdan
    // nechtasi tugaganiga qarab hisoblanadi (routine, joriy hafta, missiyalar)
    const loadProgress = useMemo(() => {
        const sources = [!routineLoading, !weeksLoading, !missionsLoading];
        const done = sources.filter(Boolean).length;
        return (done / sources.length) * 100;
    }, [routineLoading, weeksLoading, missionsLoading]);
    const anyError = routineError || weeksError || missionsError || habitSyncError;

    return (
        <>
            <Wrapper>
                <HeaderBlock>
                    <div>
                        <DateLabel>
                            {dayName.charAt(0).toUpperCase() + dayName.slice(1)}, {dateStr}
                        </DateLabel>
                        <Greeting>
                            {greeting}, {user?.ism?.split(" ")[0] || "Foydalanuvchi"} 👋
                        </Greeting>
                    </div>
                    <GoalStatsRow
                        streakDays={streakDays}
                        missionsCompleted={completedMissions}
                        missionsTotal={todayMissions.length}
                    />
                </HeaderBlock>



                {anyError && (
                    <ErrorBanner>
                        Ma'lumotlarni yuklashda xatolik yuz berdi: {anyError}
                    </ErrorBanner>
                )}

                {anyLoading && todayHabits.length === 0 && todayMissions.length === 0 ? (
                    <Loader progress={loadProgress} />
                ) : (
                    <>
                        <TopGrid>
                            <DisciplineCardWrap>
                                <DisciplineRing score={disciplineScore} />
                                <div>
                                    <DisciplineLabel>BUGUNGI INTIZOM</DisciplineLabel>
                                    <DisciplineValue>
                                        {completedHabits} / {todayHabits.length}
                                    </DisciplineValue>
                                    <DisciplineSub $done={todayHabits.length > 0 && completedHabits === todayHabits.length}>
                                        {todayHabits.length === 0
                                            ? "Bugun uchun odat topilmadi"
                                            : completedHabits === todayHabits.length
                                                ? "✓ Hammasi bajarildi!"
                                                : `${todayHabits.length - completedHabits} ta odat qoldi`}
                                    </DisciplineSub>
                                </div>
                            </DisciplineCardWrap>

                            <StatCardWrap>
                                <StatHead>
                                    <StatLabel>NAVBATDAGI ISH</StatLabel>
                                    <StatIconBox $bg={tokens.colors.amberSoft}>
                                        <Clock3 size={18} color={tokens.colors.amber} />
                                    </StatIconBox>
                                </StatHead>
                                <StatValue style={{ fontSize: 17 }}>
                                    {nextUpItem
                                        ? `${nextUpItem.icon ? nextUpItem.icon + " " : ""}${nextUpItem.title}`
                                        : "Reja tugadi"}
                                </StatValue>
                                <StatSub $color={colors.textMuted}>
                                    {nextUpItem
                                        ? `${nextUpItem.isNow ? "Hozir · " : ""}${nextUpItem.start}${nextUpItem.end ? "–" + nextUpItem.end : ""}`
                                        : "Barcha rejalashtirilgan ishlar yakunlandi"}
                                </StatSub>
                                {(nextUpHabit || nextUpMission) && (
                                    <InsightActionBtn
                                        style={{ marginTop: 10, alignSelf: "flex-start" }}
                                        onClick={() =>
                                            nextUpHabit ? handleHabitClick(nextUpHabit) : toggleMission(nextUpMission)
                                        }
                                    >
                                        {nextUpHabit ? "Belgilash" : "Bajarildi"}
                                    </InsightActionBtn>
                                )}
                            </StatCardWrap>

                            <StatCardWrap>
                                <StatHead>
                                    <StatLabel>HAFTALIK O'ZGARISH</StatLabel>
                                    <StatIconBox $bg={tokens.colors.amberSoft}>
                                        <TrendingUp size={18} color={tokens.colors.amber} />
                                    </StatIconBox>
                                </StatHead>
                                <StatValue>{currentWeekPct !== null ? `${currentWeekPct}%` : "—"}</StatValue>
                                <StatSub
                                    $color={
                                        currentWeekPct !== null && previousWeekPct !== null
                                            ? currentWeekPct >= previousWeekPct
                                                ? colors.success
                                                : colors.danger
                                            : colors.textMuted
                                    }
                                >
                                    {currentWeekPct !== null && previousWeekPct !== null
                                        ? `O'tgan haftaga nisbatan ${currentWeekPct >= previousWeekPct ? "+" : ""}${currentWeekPct - previousWeekPct}%`
                                        : "Hali ma'lumot yo'q"}
                                </StatSub>
                            </StatCardWrap>     
                           
                        </TopGrid>

                        <MainGrid>
                            <Col >
                                <SectionCard>
                                    <SectionHeader>
                                        <div>
                                            <SectionTitle>Fundamental odatlar</SectionTitle>
                                            <SectionSubtitle>Kundalik tizim asosi</SectionSubtitle>
                                        </div>
                                        <CountBadge $bg={colors.primaryLight} $color={colors.primary}>
                                            {completedHabits}/{todayHabits.length}
                                        </CountBadge>
                                    </SectionHeader>
                                    {todayHabits.length > 0 && (
                                        <HabitLegendRow>
                                            <HabitLegendItem>
                                                <HabitLegendDot $bg={colors.successLight} $border={colors.success}>✓</HabitLegendDot>
                                                Bajarildi
                                            </HabitLegendItem>
                                            <HabitLegendItem>
                                                <HabitLegendDot $bg={colors.dangerLight} $border={colors.danger}>✗</HabitLegendDot>
                                                Bajarilmadi
                                            </HabitLegendItem>
                                            <HabitLegendItem>
                                                <HabitLegendDot $bg={colors.warningLight} $border={colors.warning}>!</HabitLegendDot>
                                                Sababli
                                            </HabitLegendItem>
                                        </HabitLegendRow>
                                    )}
                                    <SectionBody prop="scroll">
                                        {todayHabits.length === 0 ? (
                                            <EmptyState>
                                                <EmptyIcon>✦</EmptyIcon>
                                                <EmptyTitle>Bugun uchun odat yo'q</EmptyTitle>
                                                <EmptySub>Routine bo'limidan odat qo'shing</EmptySub>
                                            </EmptyState>
                                        ) : (
                                            todayHabits.map((habit) => {
                                                const state = getHabitState(habit);
                                                const score = getHabitScore(habit);
                                                const isPending = pendingHabitKey === habitKey(habit);
                                                const todayPlan = habit.dayPlans?.[todayKey];
                                                return (
                                                    <Row
                                                        key={habit.id}
                                                        $done={state !== null}
                                                        $dim={state === "done" ? 0.65 : 0.8}
                                                        onClick={() => handleHabitClick(habit)}
                                                        style={isPending ? { opacity: 0.5, pointerEvents: "none" } : undefined}
                                                    >
                                                        {habitStateIcon(state)}
                                                        <RowEmoji>{habit.icon || "🕒"}</RowEmoji>
                                                        <RowBody>
                                                            <RowTitle $done={state === "done"}>
                                                                {habit.title}
                                                                {todayPlan && <TodayPlanSpan> — {todayPlan}</TodayPlanSpan>}
                                                            </RowTitle>
                                                        </RowBody>
                                                        <RowMeta>
                                                            {state === "done" && score !== null && (
                                                                <ScoreStarsRow title={`${score}/10`}>
                                                                    {[1, 2, 3, 4, 5].map((i) => (
                                                                        <Star
                                                                            key={i}
                                                                            size={11}
                                                                            color={colors.warning}
                                                                            fill={i <= score / 2 ? colors.warning : "none"}
                                                                            strokeWidth={1.5}
                                                                        />
                                                                    ))}
                                                                </ScoreStarsRow>
                                                            )}
                                                            {habit.priority && <PriorityDot $color={priorityColor(habit.priority)} />}
                                                            <TimeTag>
                                                                <Clock size={12} />
                                                                {habit.start}
                                                            </TimeTag>
                                                        </RowMeta>
                                                    </Row>
                                                );
                                            })
                                        )}
                                    </SectionBody>
                                </SectionCard>
                            </Col>

                            <Col>
                                <SectionCard style={{ padding: "20px 24px" }}>
                                    <WeeklyHeader>
                                        <WeeklyTitle>Haftalik progress</WeeklyTitle>
                                        <LegendRow>
                                            <LegendItem>
                                                <LegendDot $color={colors.primary} />
                                                <span>Ijro</span>
                                            </LegendItem>
                                        </LegendRow>
                                    </WeeklyHeader>
                                    <ChartRow>
                                        {weeklyBars.map((bar) => (
                                            <ChartCol key={bar.dayKey}>
                                                <BarTrack>
                                                    <Bar $color={colors.primary} $height={(bar.pct / 100) * 80} />
                                                </BarTrack>
                                                <DayTag>{bar.label}</DayTag>
                                            </ChartCol>
                                        ))}
                                    </ChartRow>
                                </SectionCard>

                                <InsightBox>
                                    <InsightHead>
                                        <TrendingUp size={16} color={colors.primary} />
                                        <InsightLabel>TartibOS kuzatuvi</InsightLabel>
                                    </InsightHead>
                                    <InsightText>
                                        {weeklyAvg === null
                                            ? "Bu hafta uchun hali yetarli ma'lumot yo'q. Odatlaringizni belgilab boring — birinchi kuzatuv shundan keyin paydo bo'ladi."
                                            : (
                                                <>
                                                    Ushbu hafta o'rtacha ijro <strong>{weeklyAvg}%</strong> ni tashkil etdi.{" "}
                                                    {weeklyAvg >= 75
                                                        ? "Bu ishonchli izchillik — davom ettirish o'zingiz uchun ma'qul."
                                                        : "Mumkin bo'lgan keyingi qadam: kunning bitta bandini barqarorlashtirish."}
                                                </>
                                            )}
                                    </InsightText>
                                    <InsightLink onClick={() => navigate("/statistics")}>
                                        To'liq tahlilni ko'rish <ArrowRight size={14} />
                                    </InsightLink>
                                </InsightBox>

                                <SectionCard>
                                    <SectionHeader>
                                        <div>
                                            <SectionTitle>Bugungi missiyalar</SectionTitle>
                                            <SectionSubtitle>Qo'shimcha maqsadlar</SectionSubtitle>
                                        </div>
                                        <CountBadge $bg={colors.accentLight} $color={colors.accent}>
                                            {completedMissions}/{todayMissions.length}
                                        </CountBadge>
                                    </SectionHeader>
                                    <SectionBody>
                                        {todayMissions.length === 0 ? (
                                            <EmptyState>
                                                <EmptyIcon>✦</EmptyIcon>
                                                <EmptyTitle>Bugun missiya yo'q</EmptyTitle>
                                                <EmptySub>Missions bo'limidan yangi missiya qo'shing</EmptySub>
                                            </EmptyState>
                                        ) : (
                                            todayMissions.map((mission) => (
                                                <Row
                                                    key={mission.id}
                                                    $done={mission.completed}
                                                    $dim={0.6}
                                                    onClick={() => toggleMission(mission)}
                                                >
                                                    {mission.completed ? (
                                                        <CheckCircle2 size={18} color={colors.accent} strokeWidth={2} />
                                                    ) : (
                                                        <Circle size={18} color={colors.textSubtle} strokeWidth={2} />
                                                    )}
                                                    <RowBody>
                                                        <RowTitle $done={mission.completed}>{mission.title}</RowTitle>
                                                        {mission.notes && <RowNote>{mission.notes}</RowNote>}
                                                    </RowBody>
                                                    <RowMeta>
                                                        {mission.priority && <PriorityDot $color={priorityColor(mission.priority)} />}
                                                        {mission.start && (
                                                            <TimeTag>
                                                                <Clock size={12} />
                                                                {mission.start}
                                                            </TimeTag>
                                                        )}
                                                    </RowMeta>
                                                </Row>
                                            ))
                                        )}
                                    </SectionBody>
                                </SectionCard>
                            </Col>
                        </MainGrid>

                        <DayTimeline items={timelineItems} />
                    </>
                )}
            </Wrapper>

            {reasonModal && (
                <ModalOverlay onClick={handleReasonCancel}>
                    <ModalBox onClick={(e) => e.stopPropagation()}>
                        <ModalTitle>⚠️ Sababli bajarilmadi</ModalTitle>
                        <ModalSubtitle>
                            <strong>{reasonModal.habit.title}</strong> odati bajarilmaganining
                            sababini izohlang (ixtiyoriy).
                        </ModalSubtitle>
                        <ModalTextarea
                            autoFocus
                            placeholder="Masalan: Kasallik tufayli, ish ko'pligi, kutilmagan holat..."
                            value={reasonText}
                            onChange={(e) => setReasonText(e.target.value)}
                        />
                        <ModalActions>
                            <ModalBtn type="button" onClick={handleReasonCancel}>
                                Bekor qilish
                            </ModalBtn>
                            <ModalBtn type="button" $primary onClick={handleReasonConfirm}>
                                Saqlash
                            </ModalBtn>
                        </ModalActions>
                    </ModalBox>
                </ModalOverlay>
            )}

            {ratingModal && (
                <ModalOverlay onClick={handleRatingCancel}>
                    <ModalBox onClick={(e) => e.stopPropagation()}>
                        <ModalTitle>⭐ Qanday bajardingiz?</ModalTitle>
                        <ModalSubtitle>
                            <strong>{ratingModal.habit.title}</strong> odatini qanchalik sifatli
                            bajarganingizni baholang.
                        </ModalSubtitle>
                        <RatingStarsRow onMouseLeave={() => setHoverStars(0)}>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <RatingStarBtn
                                    key={i}
                                    type="button"
                                    onMouseEnter={() => setHoverStars(i)}
                                    onClick={() => handleRatingSelect(i)}
                                >
                                    <Star
                                        size={30}
                                        color={colors.warning}
                                        fill={i <= hoverStars ? colors.warning : "none"}
                                        strokeWidth={1.5}
                                    />
                                </RatingStarBtn>
                            ))}
                        </RatingStarsRow>
                        <RatingHint $weak={hoverStars > 0 && hoverStars * 2 < 5}>
                            {hoverStars > 0
                                ? `${hoverStars * 2}/10 ball${hoverStars * 2 < 5 ? " — chala bajarilgan deb hisoblanadi" : ""}`
                                : "Yulduzchani tanlang"}
                        </RatingHint>
                        <ModalActions>
                            <ModalBtn type="button" onClick={handleRatingCancel}>
                                Bekor qilish
                            </ModalBtn>
                        </ModalActions>
                    </ModalBox>
                </ModalOverlay>
            )}
        </>
    );
};

const DisciplineRing = ({ score }) => {
    const size = 120;
    const radius = 51;
    const strokeWidth = 8;

    const circumference = 2 * Math.PI * radius;
    const strokeDash = (score / 100) * circumference;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 120 120"
            style={{ flexShrink: 0 }}
        >
            {/* Background ring */}
            <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={colors.primaryLight}
                strokeWidth={strokeWidth}
            />

            {/* Progress ring */}
            <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={colors.primary}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${strokeDash} ${circumference}`}
                transform="rotate(-90 60 60)"
                style={{
                    transition: "stroke-dasharray 0.8s ease",
                }}
            />

            {/* Score */}
            <text
                x="60"
                y="57"
                textAnchor="middle"
                fontSize="21"
                fontWeight="700"
                fill={colors.text}
                fontFamily="JetBrains Mono, monospace"
            >
                {score}%
            </text>

            {/* Label */}
            <text
                x="60"
                y="74"
                textAnchor="middle"
                fontSize="10"
                fill={colors.textSubtle}
                fontFamily="Inter, sans-serif"
            >
                intizom
            </text>
        </svg>
    );
};

export default Dashboard;