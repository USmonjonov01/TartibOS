import { useEffect, useMemo, useState, useCallback } from "react";
import { Card, Statistic, Progress, Empty } from "antd";
import { Mountain, TrendingUp, TrendingDown, Minus, Target, Flame, Star } from "lucide-react";
import { useUser } from "../../context/users";
import Loader from "../Loader";
import { useRoutine } from "../../context/routine";
import { useWeeks } from "../../context/weaks";
import { missionApi } from "../../axios";
import { filterByOwner } from "../../utils/ownership";
import { dedupeRoutines } from "../../utils/routine";
import { DAY_ORDER, DAY_LABELS_UZ, getDayKey, getISOWeekId } from "../../utils/date";
import {
    getWeekAvgPct,
    getTrackedDaysCount,
    getFullyDoneDaysCount,
    getHabitRates,
    getMissionStatsForWeek,
    getMissionStatsTotal,
    getMissionPriorityBreakdown,
    getWeeklyTrend,
} from "../../utils/stats";
import {
    Wrapper,
    Inner,
    HeaderRow,
    Eyebrow,
    Title,
    Subtitle,
    ErrorBanner,
    EmptyState,
    EmptyTitle,
    EmptySub,
    ConfrontCard,
    ConfrontLabel,
    ConfrontGrid,
    ConfrontCol,
    ConfrontWho,
    ConfrontDivider,
    ConfrontDeltaBadge,
    ConfrontNote,
    KpiGrid,
    KpiLabel,
    KpiTrendRow,
    KpiTrendValue,
    KpiInsight,
    SectionCard,
    SectionHead,
    SectionTitle,
    SectionCaption,
    TwoColGrid,
    AscentWrap,
    AscentCaption,
    DayChartRow,
    DayCol,
    DayBarTrack,
    DayBarFill,
    DayLabel,
    RosterList,
    RosterRow,
    RosterRank,
    RosterIcon,
    RosterName,
    RosterBarTrack,
    RosterBarFill,
    RosterAvgScore,
    RosterPct,
    OpsGrid,
    OpsStat,
    OpsLabel,
    OpsValue,
    PriorityStripTrack,
    PriorityStripSeg,
    PriorityLegend,
    PriorityLegendItem,
    PriorityDot,
    InsightList,
    InsightItem,
    InsightMarker,
    PieRow,
    colors,
    font,
    SectionWrapper,
} from "./style";

const fmtDelta = (delta) => {
    if (delta === null || delta === undefined) return "—";
    if (delta === 0) return "0%";
    return `${delta > 0 ? "+" : ""}${delta}%`;
};
const fmtPct = (v) => (v === null || v === undefined ? "—" : `${v}%`);
const fmtDuration = (min) => {
    const h = Math.floor(min / 60);
    const m = Math.round(min % 60);
    if (h === 0) return `${m} daq`;
    if (m === 0) return `${h} soat`;
    return `${h}s ${m}d`;
};

const polarToXY = (cx, cy, r, angleDeg) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const describeSlice = (cx, cy, r, startAngle, endAngle) => {
    const start = polarToXY(cx, cy, r, endAngle);
    const end = polarToXY(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
};

// Haqiqiy aylana diagramma — har bir dilim tashqarisiga chiqarilgan yorliq va
// bog'lovchi chiziq bilan. Bog'lovchi chiziq dilim rangida (assotsiatsiya
// uchun), lekin YORLIQ MATNI har doim mustaqil, o'qilishi oson rangda —
// dilim rangi juda xira (masalan "bo'sh vaqt") bo'lganda ham matn qorayib
// yoki ko'rinmay qolmasin uchun.
const PieChart = ({ data, size = 200 }) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    if (total <= 0) return null;

    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.32;
    const labelR = r + 20;

    let acc = 0;
    const slices = data.map((d) => {
        const startAngle = (acc / total) * 360;
        acc += d.value;
        const endAngle = (acc / total) * 360;
        return { ...d, startAngle, endAngle, midAngle: (startAngle + endAngle) / 2, pct: Math.round((d.value / total) * 100) };
    });

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
            {slices.map((s) => (
                <path
                    key={s.id}
                    d={describeSlice(cx, cy, r, s.startAngle, s.endAngle)}
                    fill={s.color}
                    stroke={colors.surface}
                    strokeWidth={2}
                />
            ))}
            {slices.map((s) => {
                if (s.pct < 2) return null;
                const edge = polarToXY(cx, cy, r, s.midAngle);
                const bend = polarToXY(cx, cy, labelR, s.midAngle);
                const goesRight = bend.x >= cx;
                const lineEndX = bend.x + (goesRight ? 10 : -10);
                return (
                    <g key={`label-${s.id}`}>
                        <polyline
                            points={`${edge.x},${edge.y} ${bend.x},${bend.y} ${lineEndX},${bend.y}`}
                            fill="none"
                            stroke={s.color}
                            strokeWidth={1.4}
                        />
                        <text
                            x={lineEndX + (goesRight ? 4 : -4)}
                            y={bend.y}
                            dominantBaseline="middle"
                            textAnchor={goesRight ? "start" : "end"}
                            fontSize="11.5"
                            fontFamily={font.body}
                            fontWeight="600"
                            fill={colors.textSecondary}
                        >
                            {s.label} {s.pct}%
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

const trendColor = (delta) => {
    if (delta === null || delta === undefined) return colors.textMuted;
    if (delta > 0) return colors.success;
    if (delta < 0) return colors.danger;
    return colors.textMuted;
};

const TrendIcon = ({ delta, size = 13 }) => {
    if (delta === null || delta === undefined) return <Minus size={size} color={colors.textMuted} />;
    if (delta > 0) return <TrendingUp size={size} color={colors.success} />;
    if (delta < 0) return <TrendingDown size={size} color={colors.danger} />;
    return <Minus size={size} color={colors.textMuted} />;
};

const RANK_COLORS = [colors.amber, "#C7D0DE", "#A9764F"];

const PRIORITY_META = {
    yuqori: { label: "Yuqori", color: colors.danger },
    ortacha: { label: "O'rtacha", color: colors.amber },
    past: { label: "Past", color: colors.success },
};

// Signature vizual — "Balandlik jurnali": har hafta bir pog'ona. Joriy hafta
// amber rangda ajratiladi, qolganlari xira po'lat rangda — orqaga qarab
// bosilgan yo'l izi.
const AscentChart = ({ trend }) => {
    if (!trend.length) return null;

    const w = 640;
    const h = 180;
    const padX = 26;
    const padTop = 26;
    const padBottom = 30;
    const usableW = w - padX * 2;
    const usableH = h - padTop - padBottom;
    const stepW = usableW / trend.length;
    const barW = Math.min(34, stepW * 0.46);

    const points = trend.map((d, i) => {
        const x = padX + stepW * i + stepW / 2;
        const y = padTop + usableH - (d.pct / 100) * usableH;
        return { x, y, pct: d.pct, weekId: d.weekId };
    });

    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
    const minWidth = Math.max(380, trend.length * 78);

    return (
        <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ minWidth, display: "block" }}>
            <line
                x1={padX}
                y1={padTop + usableH}
                x2={w - padX}
                y2={padTop + usableH}
                stroke={colors.hairline}
                strokeWidth="1"
            />
            <path d={linePath} fill="none" stroke={colors.steelPast} strokeWidth="1.5" strokeDasharray="2 5" />
            {points.map((p, i) => {
                const isLast = i === points.length - 1;
                return (
                    <g key={p.weekId}>
                        <rect
                            x={p.x - barW / 2}
                            y={p.y}
                            width={barW}
                            height={Math.max(2, padTop + usableH - p.y)}
                            rx={3}
                            fill={isLast ? colors.amber : colors.steelPastSoft}
                        />
                        <circle cx={p.x} cy={p.y} r={isLast ? 4.5 : 2.5} fill={isLast ? colors.amber : colors.steelPast} />
                        {isLast && (
                            <text
                                x={p.x}
                                y={p.y - 12}
                                textAnchor="middle"
                                fontSize="13"
                                fontWeight="700"
                                fontFamily={font.mono}
                                fill={colors.amber}
                            >
                                {p.pct}%
                            </text>
                        )}
                        <text
                            x={p.x}
                            y={h - 8}
                            textAnchor="middle"
                            fontSize="9.5"
                            fontFamily={font.mono}
                            fontWeight={isLast ? 700 : 500}
                            fill={isLast ? colors.amber : colors.textMuted}
                        >
                            {p.weekId?.split("-W")[1] ? `H${p.weekId.split("-W")[1]}` : p.weekId}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

const Statistics = () => {
    const { user } = useUser();
    const { routines, loading: routineLoading, error: routineError, fetchRoutines } = useRoutine();
    const { weeks, loading: weeksLoading, error: weeksError, fetchWeeks } = useWeeks();

    const [missions, setMissions] = useState([]);
    const [missionsLoading, setMissionsLoading] = useState(false);
    const [missionsError, setMissionsError] = useState(null);

    const fetchMissions = useCallback(async () => {
        if (!user) return;
        setMissionsLoading(true);
        setMissionsError(null);
        try {
            const { data } = await missionApi.get("/missions");
            const owned = filterByOwner(data, user.id).filter((m) => !m.cancelled && !m.__container);
            setMissions(owned);
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
    const currentWeekId = useMemo(() => getISOWeekId(now), [now]);
    const previousWeekId = useMemo(
        () => getISOWeekId(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)),
        [now]
    );
    const todayKey = useMemo(() => getDayKey(now), [now]);

    const currentWeek = useMemo(() => weeks.find((w) => w.weekId === currentWeekId), [weeks, currentWeekId]);
    const previousWeek = useMemo(() => weeks.find((w) => w.weekId === previousWeekId), [weeks, previousWeekId]);

    const totalHabitsCount = useMemo(() => dedupeRoutines(routines).length, [routines]);

    const currentPct = useMemo(() => getWeekAvgPct(currentWeek, totalHabitsCount), [currentWeek, totalHabitsCount]);
    const previousPct = useMemo(() => getWeekAvgPct(previousWeek, totalHabitsCount), [previousWeek, totalHabitsCount]);
    const overallDelta = currentPct !== null && previousPct !== null ? currentPct - previousPct : null;

    const trackedCurrent = getTrackedDaysCount(currentWeek);
    const trackedPrevious = getTrackedDaysCount(previousWeek);
    const trackedDelta = trackedPrevious !== 0 || trackedCurrent !== 0 ? trackedCurrent - trackedPrevious : null;

    const fullyDoneCurrent = getFullyDoneDaysCount(currentWeek);
    const fullyDonePrevious = getFullyDoneDaysCount(previousWeek);
    const fullyDoneDelta = fullyDoneCurrent - fullyDonePrevious;

    const missionCurrent = useMemo(() => getMissionStatsForWeek(missions, currentWeekId), [missions, currentWeekId]);
    const missionPrevious = useMemo(() => getMissionStatsForWeek(missions, previousWeekId), [missions, previousWeekId]);
    const missionDelta =
        missionCurrent.rate !== null && missionPrevious.rate !== null
            ? missionCurrent.rate - missionPrevious.rate
            : null;
    const missionTotalAllTime = useMemo(() => getMissionStatsTotal(missions), [missions]);

    const habitRates = useMemo(() => getHabitRates(routines, weeks), [routines, weeks]);
    const trackedHabitRates = useMemo(() => habitRates.filter((h) => h.scheduled > 0), [habitRates]);
    const weakestHabit = useMemo(
        () => (trackedHabitRates.length ? trackedHabitRates[trackedHabitRates.length - 1] : null),
        [trackedHabitRates]
    );
    const strongestHabit = useMemo(() => trackedHabitRates[0] || null, [trackedHabitRates]);

    const weeklyTrend = useMemo(() => getWeeklyTrend(weeks, totalHabitsCount, 8), [weeks, totalHabitsCount]);
    const priorityBreakdown = useMemo(() => getMissionPriorityBreakdown(missions), [missions]);

    // --- Routine vaqt taqsimoti: bugun faol odatlar 24 soatning qancha
    // qismini egallayotgani + muhimlik darajasi bo'yicha bajarilish holati ---
    const dedupedRoutines = useMemo(() => dedupeRoutines(routines), [routines]);
    const routineRateById = useMemo(() => {
        const map = new Map();
        habitRates.forEach((h) => map.set(h.id, h));
        return map;
    }, [habitRates]);

    const toMinutes = (hhmm) => {
        if (!hhmm || typeof hhmm !== "string" || !hhmm.includes(":")) return null;
        const [h, m] = hhmm.split(":").map(Number);
        if (Number.isNaN(h) || Number.isNaN(m)) return null;
        return h * 60 + m;
    };

    const todayRoutines = useMemo(
        () => dedupedRoutines.filter((r) => !r.days || r.days.length === 0 || r.days.includes(todayKey)),
        [dedupedRoutines, todayKey]
    );

    const routineTimeStats = useMemo(() => {
        const byPriority = { yuqori: 0, ortacha: 0, past: 0 };
        let occupiedMin = 0;

        todayRoutines.forEach((r) => {
            const start = toMinutes(r.start);
            const end = toMinutes(r.end);
            const duration = start !== null && end !== null && end > start ? end - start : 30;
            occupiedMin += duration;
            const p = r.priority && byPriority[r.priority] !== undefined ? r.priority : "ortacha";
            byPriority[p] += duration;
        });

        const occupiedPct = Math.min(100, Math.round((occupiedMin / 1440) * 100));
        return { occupiedMin, occupiedPct, freeMin: Math.max(1440 - occupiedMin, 0), byPriority };
    }, [todayRoutines]);

    // Aynan qaysi odat 24 soatning eng katta qismini egallayotgani — eng
    // uzoq davom etadigan 4 ta odat alohida, qolganlari "Boshqa odatlar"da.
    // MUHIM: rang har doim aniq belgilangan token bo'lishi kerak — avval
    // bu yerda `colors.muted` ishlatilgan edi, lekin bunday kalit tokens
    // ichida yo'q edi, shuning uchun fill "undefined" bo'lib, brauzer uni
    // qora rangga standartlashtirib qo'ygan (ekrandagi katta qora dilim —
    // aynan shu bug edi). Endi mavjud `colors.textMuted` ishlatiladi.
    const HABIT_CHART_COLORS = [colors.primary, colors.steelPast, colors.success, colors.amberStrong];

    const habitTimeBreakdown = useMemo(() => {
        const withDuration = todayRoutines
            .map((r) => {
                const start = toMinutes(r.start);
                const end = toMinutes(r.end);
                const duration = start !== null && end !== null && end > start ? end - start : 30;
                return { id: r.id, title: r.title, icon: r.icon, duration };
            })
            .sort((a, b) => b.duration - a.duration);

        const top = withDuration.slice(0, 4).map((r, i) => ({
            ...r,
            color: HABIT_CHART_COLORS[i % HABIT_CHART_COLORS.length],
        }));
        const restDuration = withDuration.slice(4).reduce((sum, r) => sum + r.duration, 0);
        if (restDuration > 0) {
            top.push({ id: "rest", title: "Boshqa odatlar", icon: null, duration: restDuration, color: colors.textMuted });
        }

        return top;
    }, [todayRoutines]);

    const priorityPieData = useMemo(
        () =>
            [
                { id: "yuqori", label: "Yuqori muhimlik", value: routineTimeStats.byPriority.yuqori, color: PRIORITY_META.yuqori.color },
                { id: "ortacha", label: "O'rtacha muhimlik", value: routineTimeStats.byPriority.ortacha, color: PRIORITY_META.ortacha.color },
                { id: "past", label: "Past muhimlik", value: routineTimeStats.byPriority.past, color: PRIORITY_META.past.color },
                // "Bo'sh vaqt" — hali band qilinmagan vaqt. Avval juda xira
                // (`hairlineSoft`) rangda edi, shuning uchun deyarli
                // ko'rinmas / "qora"dek tuyular edi. Endi ancha ochiqroq,
                // lekin baribir neytral `hairline` rangida — band vaqt
                // dilimlaridan farqlanib turadi, ammo diqqatni tortmaydi.
                { id: "free", label: "Bo'sh vaqt", value: routineTimeStats.freeMin, color: colors.hairline },
            ].filter((d) => d.value > 0),
        [routineTimeStats]
    );

    const habitPieData = useMemo(
        () => habitTimeBreakdown.map((h) => ({ id: h.id, label: h.title, value: h.duration, color: h.color })),
        [habitTimeBreakdown]
    );

    const anyLoading = routineLoading || weeksLoading || missionsLoading;
    const anyError = routineError || weeksError || missionsError;
    const hasAnyHistory = weeks.length > 0 || missions.length > 0;

    const insights = useMemo(() => {
        const list = [];

        if (currentPct === null && previousPct === null) {
            list.push(
                "Hali odatlaringiz bo'yicha kuzatuv ma'lumoti yo'q. Dashboard sahifasida bugungi odatlaringizni belgilashni boshlang — birinchi pog'ona shu yerda paydo bo'ladi."
            );
        } else if (previousPct === null) {
            list.push(
                <>
                    Bu hafta odatlar bo'yicha o'rtacha ijro <strong>{currentPct}%</strong>. Solishtirish uchun
                    oldingi hafta ma'lumoti hali yetarli emas — keyingi haftada tendensiya ko'rina boshlaydi.
                </>
            );
        } else {
            const direction =
                overallDelta > 0 ? "ko'tarilmoqda" : overallDelta < 0 ? "pasaymoqda" : "bir xil balandlikda saqlanmoqda";
            list.push(
                <>
                    Bu hafta siz o'tgan haftadagi o'zingizga nisbatan <strong>{direction}</strong>: hozir{" "}
                    <strong>{currentPct}%</strong>, o'tgan haftada <strong>{previousPct}%</strong> edingiz (farq:{" "}
                    <strong>{fmtDelta(overallDelta)}</strong>).
                </>
            );
        }

        if (weakestHabit && weakestHabit.rate < 70) {
            list.push(
                <>
                    Eng ko'p e'tibor talab qiladigan odat — <strong>{weakestHabit.title}</strong> (
                    {weakestHabit.rate}%, {weakestHabit.completed}/{weakestHabit.scheduled} kun). Shu odatga
                    diqqatni kuchaytirsangiz, umumiy pog'ona sezilarli ko'tariladi.
                </>
            );
        }

        if (strongestHabit && strongestHabit.rate >= 70 && strongestHabit.id !== weakestHabit?.id) {
            list.push(
                <>
                    Eng izchil bajarilayotgan odat — <strong>{strongestHabit.title}</strong> ({strongestHabit.rate}
                    %). Bu yerda siz allaqachon barqaror pog'onadasiz.
                </>
            );
        }

        if (missionCurrent.total > 0) {
            if (missionDelta !== null) {
                const missionDirection =
                    missionDelta > 0 ? "yaxshilanmoqda" : missionDelta < 0 ? "pasaymoqda" : "bir xil darajada";
                list.push(
                    <>
                        Missiyalar bo'yicha bu hafta <strong>{missionCurrent.completed}/{missionCurrent.total}</strong>{" "}
                        ({missionCurrent.rate}%) bajarildi, natija oldingi haftaga nisbatan{" "}
                        <strong>{missionDirection}</strong> (farq: <strong>{fmtDelta(missionDelta)}</strong>).
                    </>
                );
            } else {
                list.push(
                    <>
                        Missiyalar bo'yicha bu hafta <strong>{missionCurrent.completed}/{missionCurrent.total}</strong>{" "}
                        ({missionCurrent.rate}%) bajarildi.
                    </>
                );
            }
        } else if (missionTotalAllTime.total > 0) {
            list.push(
                <>
                    Bu haftaga tegishli missiya yo'q, lekin jami <strong>{missionTotalAllTime.total}</strong>{" "}
                    missiyadan <strong>{missionTotalAllTime.completed}</strong> tasi bajarilgan (
                    {missionTotalAllTime.rate}%).
                </>
            );
        }

        return list;
    }, [
        currentPct,
        previousPct,
        overallDelta,
        weakestHabit,
        strongestHabit,
        missionCurrent,
        missionDelta,
        missionTotalAllTime,
    ]);

    const priorityTotal = priorityBreakdown.total || 0;

    return (
        <Wrapper>
            <Inner>
                <HeaderRow>
                    <Eyebrow>Ekspeditsiya jurnali</Eyebrow>
                    <Title>Statistika</Title>
                    <Subtitle>
                        Bu — hissiyot emas, hisobot. Har bir raqam siz haqiqatda bajargan (yoki bajarmagan) narsadan
                        kelib chiqadi.
                    </Subtitle>
                </HeaderRow>

                {anyError && <ErrorBanner>Ma'lumotlarni yuklashda xatolik yuz berdi: {anyError}</ErrorBanner>}

                {anyLoading && !hasAnyHistory ? (
                    <Loader />
                ) : !hasAnyHistory && totalHabitsCount === 0 ? (
                    <EmptyState>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <>
                                    <EmptyTitle>Jurnal hali bo'sh</EmptyTitle>
                                    <EmptySub>
                                        Routine sahifasida odatlar qo'shing va Dashboard'da kunlik bajarishni
                                        belgilang — birinchi pog'ona shu yerda paydo bo'ladi.
                                    </EmptySub>
                                </>
                            }
                        />
                    </EmptyState>
                ) : (
                    <>
                        <ConfrontCard>
                            <ConfrontLabel>
                                <Mountain size={14} color={colors.amber} />
                                Siz vs siz — joriy hafta va o'tgan hafta
                            </ConfrontLabel>
                            <ConfrontGrid>
                                <ConfrontCol $dim>
                                    <ConfrontWho $muted>O'TGAN HAFTADAGI SIZ</ConfrontWho>
                                    <Statistic
                                        value={previousPct === null ? "—" : previousPct}
                                        suffix={previousPct === null ? "" : "%"}
                                        valueStyle={{
                                            fontFamily: font.mono,
                                            fontWeight: 700,
                                            fontSize: 40,
                                            color: colors.textSecondary,
                                        }}
                                    />
                                </ConfrontCol>

                                <ConfrontDivider />

                                <ConfrontCol>
                                    <ConfrontWho>BUGUNGI SIZ</ConfrontWho>
                                    <Statistic
                                        value={currentPct === null ? "—" : currentPct}
                                        suffix={currentPct === null ? "" : "%"}
                                        valueStyle={{
                                            fontFamily: font.mono,
                                            fontWeight: 700,
                                            fontSize: 40,
                                            color: colors.textPrimary,
                                        }}
                                    />
                                    <ConfrontDeltaBadge
                                        $bg={
                                            overallDelta > 0
                                                ? colors.successSoft
                                                : overallDelta < 0
                                                    ? colors.dangerSoft
                                                    : colors.hairlineSoft
                                        }
                                        $color={trendColor(overallDelta)}
                                    >
                                        <TrendIcon delta={overallDelta} size={15} />
                                        {fmtDelta(overallDelta)}
                                    </ConfrontDeltaBadge>
                                </ConfrontCol>
                            </ConfrontGrid>
                            <ConfrontNote>
                                Farq — sizning haqiqiy harakatingiz, taxmin emas: {trackedCurrent} kun kuzatilgan bu
                                hafta, {trackedPrevious} kun — o'tganida.
                            </ConfrontNote>
                        </ConfrontCard>

                        <KpiGrid>
                            <Card size="small">
                                <KpiLabel>ODAT BAJARISH</KpiLabel>
                                <Statistic
                                    value={currentPct === null ? "—" : currentPct}
                                    suffix={currentPct === null ? "" : "%"}
                                    valueStyle={{ fontFamily: font.mono, fontWeight: 700, fontSize: 24 }}
                                />
                                <KpiTrendRow>
                                    <TrendIcon delta={overallDelta} />
                                    <KpiTrendValue $color={trendColor(overallDelta)}>{fmtDelta(overallDelta)}</KpiTrendValue>
                                    <KpiInsight>o'tgan haftaga nisbatan</KpiInsight>
                                </KpiTrendRow>
                            </Card>

                            <Card size="small">
                                <KpiLabel>MISSIYA BAJARISH</KpiLabel>
                                <Statistic
                                    value={missionCurrent.rate === null ? "—" : missionCurrent.rate}
                                    suffix={missionCurrent.rate === null ? "" : "%"}
                                    valueStyle={{ fontFamily: font.mono, fontWeight: 700, fontSize: 24 }}
                                />
                                <KpiTrendRow>
                                    <TrendIcon delta={missionDelta} />
                                    <KpiTrendValue $color={trendColor(missionDelta)}>{fmtDelta(missionDelta)}</KpiTrendValue>
                                    <KpiInsight>
                                        {missionCurrent.completed}/{missionCurrent.total} bu hafta
                                    </KpiInsight>
                                </KpiTrendRow>
                            </Card>

                            <Card size="small">
                                <KpiLabel>FAOL KUNLAR</KpiLabel>
                                <Statistic
                                    value={`${trackedCurrent}/7`}
                                    valueStyle={{ fontFamily: font.mono, fontWeight: 700, fontSize: 24 }}
                                />
                                <KpiTrendRow>
                                    <TrendIcon delta={trackedDelta} />
                                    <KpiTrendValue $color={trendColor(trackedDelta)}>
                                        {trackedDelta === null ? "—" : `${trackedDelta > 0 ? "+" : ""}${trackedDelta} kun`}
                                    </KpiTrendValue>
                                    <KpiInsight>o'tgan hafta: {trackedPrevious}/7</KpiInsight>
                                </KpiTrendRow>
                            </Card>

                            <Card size="small">
                                <KpiLabel>TO'LIQ BAJARILGAN KUNLAR</KpiLabel>
                                <Statistic
                                    value={`${fullyDoneCurrent}/7`}
                                    valueStyle={{ fontFamily: font.mono, fontWeight: 700, fontSize: 24 }}
                                />
                                <KpiTrendRow>
                                    <TrendIcon delta={fullyDoneDelta} />
                                    <KpiTrendValue $color={trendColor(fullyDoneDelta)}>
                                        {`${fullyDoneDelta > 0 ? "+" : ""}${fullyDoneDelta} kun`}
                                    </KpiTrendValue>
                                    <KpiInsight>o'tgan hafta: {fullyDonePrevious}/7</KpiInsight>
                                </KpiTrendRow>
                            </Card>
                        </KpiGrid>

                        <SectionCard>
                            <SectionHead>
                                <div>
                                    <SectionTitle>
                                        <Mountain size={16} color={colors.amber} />
                                        Balandlik jurnali
                                    </SectionTitle>
                                    <SectionCaption>Har bir pog'ona — bir hafta. Amber ustun — siz hozir turgan joy.</SectionCaption>
                                </div>
                            </SectionHead>

                            {weeklyTrend.length === 0 ? (
                                <EmptySub>Hali kuzatilgan hafta yo'q — birinchi pog'ona shu yerda paydo bo'ladi.</EmptySub>
                            ) : (
                                <AscentWrap>
                                    <AscentChart trend={weeklyTrend} />
                                    <AscentCaption>
                                        So'nggi {weeklyTrend.length} ta kuzatilgan hafta bo'yicha o'rtacha ijro foizi.
                                    </AscentCaption>
                                </AscentWrap>
                            )}
                        </SectionCard>

                        <TwoColGrid>
                            <SectionCard>
                                <SectionHead>
                                    <div>
                                        <SectionTitle>Bu hafta — kunma-kun</SectionTitle>
                                        <SectionCaption>
                                            {trackedCurrent === 0
                                                ? "Hali hech qanday kun belgilanmagan"
                                                : `${trackedCurrent} kun kuzatilgan, o'rtacha ${fmtPct(currentPct)}`}
                                        </SectionCaption>
                                    </div>
                                </SectionHead>

                                {trackedCurrent === 0 ? (
                                    <EmptySub>Dashboard'da bugungi odatlarni belgilang</EmptySub>
                                ) : (
                                    <DayChartRow>
                                        {DAY_ORDER.map((dayKey) => {
                                            const statuses = currentWeek?.statuses || {};
                                            const executions = currentWeek?.executions?.[dayKey];
                                            const hasData = statuses[dayKey] !== undefined;
                                            const pct =
                                                hasData && totalHabitsCount > 0
                                                    ? Math.min(100, Math.round((executions / totalHabitsCount) * 100))
                                                    : 0;
                                            const isToday = dayKey === todayKey;
                                            return (
                                                <DayCol key={dayKey}>
                                                    <DayBarTrack>
                                                        <DayBarFill $pct={hasData ? pct : 0} $isToday={isToday} />
                                                    </DayBarTrack>
                                                    <DayLabel $isToday={isToday}>
                                                        {DAY_LABELS_UZ[DAY_ORDER.indexOf(dayKey)]}
                                                    </DayLabel>
                                                </DayCol>
                                            );
                                        })}
                                    </DayChartRow>
                                )}
                            </SectionCard>

                            <SectionCard>
                                <SectionHead>
                                    <div>
                                        <SectionTitle>
                                            <Target size={16} color={colors.amber} />
                                            Odatlar reytingi
                                        </SectionTitle>
                                        <SectionCaption>Barcha kuzatilgan tarix bo'yicha</SectionCaption>
                                    </div>
                                </SectionHead>

                                {trackedHabitRates.length === 0 ? (
                                    <EmptySub>Hali kuzatilgan odat yo'q</EmptySub>
                                ) : (
                                    <RosterList>
                                        {trackedHabitRates.map((habit, i) => (
                                            <RosterRow key={habit.id}>
                                                <RosterRank $color={RANK_COLORS[i] || colors.textMuted}>{i + 1}</RosterRank>
                                                {habit.icon && <RosterIcon>{habit.icon}</RosterIcon>}
                                                <RosterName>{habit.title}</RosterName>
                                                <RosterBarTrack>
                                                    <RosterBarFill
                                                        $pct={habit.rate || 0}
                                                        $color={
                                                            habit.rate >= 70 ? colors.success : habit.rate >= 40 ? colors.amber : colors.danger
                                                        }
                                                    />
                                                </RosterBarTrack>
                                                {habit.avgScore !== null && (
                                                    <RosterAvgScore
                                                        title="O'rtacha sifat balli"
                                                        $weak={habit.avgScore < 5}
                                                    >
                                                        <Star size={11} fill="currentColor" strokeWidth={0} />
                                                        {habit.avgScore}
                                                    </RosterAvgScore>
                                                )}
                                                <RosterPct
                                                    $color={
                                                        habit.rate >= 70 ? colors.success : habit.rate >= 40 ? colors.amber : colors.danger
                                                    }
                                                >
                                                    {habit.rate || 0}%
                                                </RosterPct>
                                            </RosterRow>
                                        ))}
                                    </RosterList>
                                )}
                            </SectionCard>
                        </TwoColGrid>

                        <SectionCard>
                            <SectionHead>
                                <div>
                                    <SectionTitle>
                                        <Flame size={16} color={colors.amber} />
                                        Missiya operatsiyalari
                                    </SectionTitle>
                                    <SectionCaption>Barcha vaqt bo'yicha jami</SectionCaption>
                                </div>
                            </SectionHead>

                            <OpsGrid>
                                <OpsStat>
                                    <OpsLabel>JAMI MISSIYA</OpsLabel>
                                    <OpsValue>{missionTotalAllTime.total}</OpsValue>
                                </OpsStat>
                                <OpsStat>
                                    <OpsLabel>BAJARILGAN</OpsLabel>
                                    <OpsValue>{missionTotalAllTime.completed}</OpsValue>
                                </OpsStat>
                                <OpsStat>
                                    <OpsLabel>UMUMIY DARAJA</OpsLabel>
                                    <OpsValue>{fmtPct(missionTotalAllTime.rate)}</OpsValue>
                                </OpsStat>
                            </OpsGrid>

                            {priorityTotal > 0 && (
                                <>
                                    <PriorityStripTrack>
                                        {Object.entries(priorityBreakdown.counts).map(([key, count]) =>
                                            count > 0 ? (
                                                <PriorityStripSeg
                                                    key={key}
                                                    $pct={(count / priorityTotal) * 100}
                                                    $color={PRIORITY_META[key]?.color || colors.textMuted}
                                                />
                                            ) : null
                                        )}
                                    </PriorityStripTrack>
                                    <PriorityLegend>
                                        {Object.entries(priorityBreakdown.counts).map(([key, count]) => (
                                            <PriorityLegendItem key={key}>
                                                <PriorityDot $color={PRIORITY_META[key]?.color || colors.textMuted} />
                                                {PRIORITY_META[key]?.label || key}: {count}
                                            </PriorityLegendItem>
                                        ))}
                                    </PriorityLegend>
                                </>
                            )}
                        </SectionCard>

                        <SectionWrapper>
                            {routineTimeStats.occupiedMin > 0 && (
                                <SectionCard>
                                    <SectionHead>
                                        <div>
                                            <SectionTitle>
                                                <Target size={16} color={colors.amber} />
                                                Kunlik vaqt taqsimoti
                                            </SectionTitle>
                                            <SectionCaption>
                                                Bugungi odatlar 24 soatning qancha qismini egallaydi — jami{" "}
                                                {fmtDuration(routineTimeStats.occupiedMin)} ({routineTimeStats.occupiedPct}%)
                                            </SectionCaption>
                                        </div>
                                    </SectionHead>

                                    <PieRow>
                                        <PieChart data={priorityPieData} />
                                    </PieRow>
                                </SectionCard>
                            )}

                            {habitPieData.length > 0 && (
                                <SectionCard>
                                    <SectionHead>
                                        <div>
                                            <SectionTitle>
                                                <Mountain size={16} color={colors.amber} />
                                                Eng ko'p vaqt oluvchi odatlar
                                            </SectionTitle>
                                            <SectionCaption>Bugungi band vaqt ichida qaysi odat qancha ulush oladi</SectionCaption>
                                        </div>
                                    </SectionHead>

                                    <PieRow>
                                        <PieChart data={habitPieData} />
                                    </PieRow>
                                </SectionCard>
                            )}
                        </SectionWrapper>

                        {insights.length > 0 && (
                            <SectionCard>
                                <SectionHead>
                                    <div>
                                        <SectionTitle>Dala eslatmalari</SectionTitle>
                                        <SectionCaption>Tizim xulosasi — faqat haqiqiy hisoblangan qiymatlardan</SectionCaption>
                                    </div>
                                </SectionHead>
                                <InsightList>
                                    {insights.map((text, i) => (
                                        <InsightItem key={i}>
                                            <InsightMarker>{String(i + 1).padStart(2, "0")}</InsightMarker>
                                            <div>{text}</div>
                                        </InsightItem>
                                    ))}
                                </InsightList>
                            </SectionCard>
                        )}
                    </>
                )}
            </Inner>
        </Wrapper>
    );
};

export default Statistics;