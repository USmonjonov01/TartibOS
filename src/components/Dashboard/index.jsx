import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    CheckCircle2,
    Circle,
    XCircle,
    AlertCircle,
    Clock,
    ArrowRight,
    TrendingUp,
    Flame,
    Star,
} from "lucide-react";
import { useUser } from "../../context/users";
import { useRoutine } from "../../context/routine";
import { useWeeks } from "../../context/weaks";
import { useNotifications } from "../../context/notifications";
import { missionApi } from "../../axios";
import { getTodayHabits, dedupeRoutines, habitKey } from "../../utils/routine";
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
    StatusText,
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
    colors,
} from "./style";

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
    const totalHabitsCount = useMemo(() => dedupeRoutines(routines).length, [routines]);

    const currentWeekId = useMemo(() => getISOWeekId(now), [now]);
    const currentWeek = useMemo(
        () => weeks.find((w) => w.weekId === currentWeekId),
        [weeks, currentWeekId]
    );

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

    const completedHabits = todayHabits.filter((h) => getHabitState(h) === "done").length;
    const disciplineScore = todayHabits.length > 0
        ? Math.round((completedHabits / todayHabits.length) * 100)
        : 0;

    const applyHabitStateChange = useCallback(
        ({ habit, newState, note }) => {
            const key = habitKey(habit);
            if (pendingHabitKey) return;

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

            setHabitSyncError(null);
            setPendingHabitKey(key);

            const task = () =>
                saveDayCompletion({
                    week: currentWeekRef.current,
                    weekId: currentWeekId,
                    dayKey: todayKey,
                    habitIds,
                    reasons: nextReasons,
                    totalHabits: todayHabits.length,
                })
                    .catch((err) => {
                        setHabitSyncError(
                            err.response?.data?.message || err.message || "Odat holatini saqlashda xatolik"
                        );
                    })
                    .finally(() => setPendingHabitKey(null));

            saveQueueRef.current = saveQueueRef.current.then(task, task);
        },
        [pendingHabitKey, todayKey, currentWeekId, todayHabits.length, saveDayCompletion]
    );

    const handleHabitClick = (habit) => {
        if (pendingHabitKey) return;
        const current = getHabitState(habit);
        const next = nextHabitState(current);
        if (next === "excused") {
            setReasonModal({ habit });
            setReasonText("");
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

    const todayMissions = useMemo(
        () => missions.filter((m) => !m.__container && m.date === todayDateStr && !m.cancelled),
        [missions, todayDateStr]
    );
    const completedMissions = todayMissions.filter((m) => m.completed).length;

    const toggleMission = async (mission) => {
        const nextCompleted = !mission.completed;
        setMissions((prev) =>
            prev.map((m) => (m.id === mission.id ? { ...m, completed: nextCompleted } : m))
        );
        try {
            await missionApi.put(`/Mission/${mission.id}`, { ...mission, completed: nextCompleted });
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
            const pct = hasData && totalHabitsCount > 0
                ? Math.min(100, Math.round((executions / totalHabitsCount) * 100))
                : 0;
            return {
                dayKey,
                label: DAY_LABELS_UZ[i],
                pct,
                hasData,
            };
        });
    }, [currentWeek, totalHabitsCount]);

    const trackedDays = weeklyBars.filter((b) => b.hasData);
    const weeklyAvg = trackedDays.length > 0
        ? Math.round(trackedDays.reduce((sum, b) => sum + b.pct, 0) / trackedDays.length)
        : null;

    const streakDays = currentWeek
        ? Object.values(currentWeek.statuses || {}).filter((s) => s === "completed").length
        : 0;
    const streakTotalTracked = currentWeek ? Object.keys(currentWeek.statuses || {}).length : 0;

    const anyLoading = routineLoading || weeksLoading || missionsLoading;
    const anyError = routineError || weeksError || missionsError || habitSyncError;

    return (
        <>
        <Wrapper>
            <HeaderBlock>
                <DateLabel>
                    {dayName.charAt(0).toUpperCase() + dayName.slice(1)}, {dateStr}
                </DateLabel>
                <Greeting>
                    {greeting}, {user?.ism?.split(" ")[0] || "Foydalanuvchi"} 👋
                </Greeting>
            </HeaderBlock>

            {anyError && (
                <ErrorBanner>
                    Ma'lumotlarni yuklashda xatolik yuz berdi: {anyError}
                </ErrorBanner>
            )}

            {anyLoading && todayHabits.length === 0 && todayMissions.length === 0 ? (
                <StatusText>Yuklanmoqda...</StatusText>
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
                                <StatLabel>HAFTALIK STREAK</StatLabel>
                                <StatIconBox $bg={colors.warningLight}>
                                    <Flame size={18} color={colors.warning} />
                                </StatIconBox>
                            </StatHead>
                            <StatValue>{streakDays} kun</StatValue>
                            <StatSub $color={colors.warning}>
                                {!currentWeek
                                    ? "Bu hafta ma'lumot yo'q"
                                    : streakDays === streakTotalTracked && streakDays > 0
                                        ? "Hammasi bajarildi!"
                                        : `${streakTotalTracked} kundan ${streakDays} tasi bajarildi`}
                            </StatSub>
                        </StatCardWrap>

                        <StatCardWrap>
                            <StatHead>
                                <StatLabel>MISSIYALAR (BUGUN)</StatLabel>
                                <StatIconBox $bg={colors.accentLight}>
                                    <Star size={18} color={colors.accent} />
                                </StatIconBox>
                            </StatHead>
                            <StatValue>
                                {completedMissions} / {todayMissions.length}
                            </StatValue>
                            <StatSub $color={colors.accent}>
                                {todayMissions.length === 0
                                    ? "Bugun uchun missiya yo'q"
                                    : completedMissions === todayMissions.length
                                        ? "Hammasi bajarildi!"
                                        : `${todayMissions.length - completedMissions} ta qoldi`}
                            </StatSub>
                        </StatCardWrap>
                    </TopGrid>

                    <MainGrid>
                        <Col>
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
                                <SectionBody>
                                    {todayHabits.length === 0 ? (
                                        <EmptyState>
                                            <EmptyIcon>✦</EmptyIcon>
                                            <EmptyTitle>Bugun uchun odat yo'q</EmptyTitle>
                                            <EmptySub>Routine bo'limidan odat qo'shing</EmptySub>
                                        </EmptyState>
                                    ) : (
                                        todayHabits.map((habit) => {
                                            const state = getHabitState(habit);
                                            const isPending = pendingHabitKey === habitKey(habit);
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
                                                        <RowTitle $done={state === "done"}>{habit.title}</RowTitle>
                                                    </RowBody>
                                                    <RowMeta>
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
                                                    <CheckCircle2 size={20} color={colors.accent} strokeWidth={2} />
                                                ) : (
                                                    <Circle size={20} color={colors.textSubtle} strokeWidth={2} />
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
                                    <InsightLabel>Tizim xulosasi</InsightLabel>
                                </InsightHead>
                                <InsightText>
                                    {weeklyAvg === null
                                        ? "Bu hafta uchun hali yetarli ma'lumot yo'q. Odatlaringizni bajarib boring, tizim tahlil qila boshlaydi."
                                        : (
                                            <>
                                                Ushbu hafta o'rtacha ijro <strong>{weeklyAvg}%</strong>.{" "}
                                                {weeklyAvg >= 75
                                                    ? "Zo'r natija, shu tezlikda davom eting!"
                                                    : "Yana biroz sa'y-harakat kerak."}
                                            </>
                                        )}
                                </InsightText>
                                <InsightLink onClick={() => navigate("/statistics")}>
                                    To'liq tahlilni ko'rish <ArrowRight size={14} />
                                </InsightLink>
                            </InsightBox>
                        </Col>
                    </MainGrid>
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
        </>
    );
};

const DisciplineRing = ({ score }) => {
    const circumference = 2 * Math.PI * 44;
    const strokeDash = (score / 100) * circumference;

    return (
        <svg width={100} height={100} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke={colors.primaryLight} strokeWidth="8" />
            <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke={colors.primary}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${strokeDash} ${circumference}`}
                transform="rotate(-90 50 50)"
                style={{ transition: "stroke-dasharray 0.8s ease" }}
            />
            <text x="50" y="46" textAnchor="middle" fontSize="20" fontWeight="700" fill={colors.text} fontFamily="JetBrains Mono, monospace">
                {score}%
            </text>
            <text x="50" y="62" textAnchor="middle" fontSize="10" fill={colors.textSubtle} fontFamily="Inter, sans-serif">
                intizom
            </text>
        </svg>
    );
};

export default Dashboard;