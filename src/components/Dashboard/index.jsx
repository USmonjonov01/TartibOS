import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    CheckCircle2,
    Circle,
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
import { filterByOwner } from "../../utils/ownership";
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
    colors,
} from "./style";

const PRIORITY_COLORS = {
    yuqori: colors.danger,
    ortacha: colors.warning,
    past: colors.success,
};

const priorityColor = (priority) => PRIORITY_COLORS[priority] || colors.textSubtle;

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { routines, loading: routineLoading, error: routineError, fetchRoutines } = useRoutine();
    const { weeks, loading: weeksLoading, error: weeksError, fetchWeeks, saveDayCompletion } = useWeeks();
    const { notifyMissionCompleted } = useNotifications();

    const [missions, setMissions] = useState([]);
    const [missionsLoading, setMissionsLoading] = useState(false);
    const [missionsError, setMissionsError] = useState(null);
    const [completedHabitIds, setCompletedHabitIds] = useState(() => new Set());
    const [habitSyncError, setHabitSyncError] = useState(null);

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

    // Bugungi bajarilgan odatlar ro'yxati serverdan (weeks.completions) o'qiladi —
    // shu sabab sahifa yangilansa ham (refresh) holat saqlanib qoladi. Optimistik
    // lokal o'zgarishlarga (toggleHabit) yo'l qo'yish uchun bu render vaqtida
    // moslashtiriladi, effect ichida emas.
    const serverHabitIds = currentWeek?.completions?.[todayKey];
    const [syncedServerIds, setSyncedServerIds] = useState(serverHabitIds);
    if (serverHabitIds !== syncedServerIds) {
        setSyncedServerIds(serverHabitIds);
        setCompletedHabitIds(new Set(serverHabitIds || []));
    }

    // Ketma-ket bosishlarda ikki marta yangi hafta yozuvi yaratilib qolmasligi
    // uchun so'rovlarni navbatga qo'yamiz va har doim eng so'nggi week holatidan foydalanamiz.
    const currentWeekRef = useRef(currentWeek);
    useEffect(() => {
        currentWeekRef.current = currentWeek;
    }, [currentWeek]);
    const saveQueueRef = useRef(Promise.resolve());

    const completedHabits = todayHabits.filter((h) => completedHabitIds.has(habitKey(h))).length;
    const disciplineScore = todayHabits.length > 0
        ? Math.round((completedHabits / todayHabits.length) * 100)
        : 0;

    const toggleHabit = (habit) => {
        const key = habitKey(habit);
        setHabitSyncError(null);
        const previous = completedHabitIds;
        const next = new Set(previous);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        setCompletedHabitIds(next);

        const habitIds = Array.from(next);
        const task = () =>
            saveDayCompletion({
                week: currentWeekRef.current,
                weekId: currentWeekId,
                dayKey: todayKey,
                habitIds,
                totalHabits: todayHabits.length,
            }).catch((err) => {
                setCompletedHabitIds(previous);
                setHabitSyncError(
                    err.response?.data?.message || err.message || "Odat holatini saqlashda xatolik"
                );
            });

        saveQueueRef.current = saveQueueRef.current.then(task, task);
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
                                <SectionBody>
                                    {todayHabits.length === 0 ? (
                                        <EmptyState>
                                            <EmptyIcon>✦</EmptyIcon>
                                            <EmptyTitle>Bugun uchun odat yo'q</EmptyTitle>
                                            <EmptySub>Routine bo'limidan odat qo'shing</EmptySub>
                                        </EmptyState>
                                    ) : (
                                        todayHabits.map((habit) => {
                                            const done = completedHabitIds.has(habitKey(habit));
                                            return (
                                                <Row key={habit.id} $done={done} onClick={() => toggleHabit(habit)}>
                                                    {done ? (
                                                        <CheckCircle2 size={20} color={colors.success} strokeWidth={2} />
                                                    ) : (
                                                        <Circle size={20} color={colors.textSubtle} strokeWidth={2} />
                                                    )}
                                                    <RowEmoji>{habit.icon || "🕒"}</RowEmoji>
                                                    <RowBody>
                                                        <RowTitle $done={done}>{habit.title}</RowTitle>
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