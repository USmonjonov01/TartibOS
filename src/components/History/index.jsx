import { useMemo, useState, useCallback, useEffect } from "react";
import { ArrowLeft, CalendarClock, CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";
import { useUser } from "../../context/users";
import { useRoutine } from "../../context/routine";
import { useWeeks } from "../../context/weaks";
import { dedupeRoutines, habitKey } from "../../utils/routine";
import {
    DAY_ORDER,
    DAY_LABELS_UZ,
    getISOWeekId,
    getDateStr,
    getDateForWeekDay,
    getMondayOfISOWeek,
} from "../../utils/date";
import { getWeekAvgPct } from "../../utils/stats";
import {
    Wrapper,
    Inner,
    HeaderRow,
    Eyebrow,
    Title,
    Subtitle,
    StatusText,
    ErrorBanner,
    EmptyState,
    EmptyTitle,
    EmptySub,
    SectionCard,
    SectionHead,
    SectionTitle,
    SectionCaption,
    WeekList,
    WeekRow,
    WeekRowMain,
    WeekRange,
    WeekIdTag,
    WeekBadgeCurrent,
    WeekTrackedTag,
    WeekPctBadge,
    BackRow,
    BackButton,
    NoticeBanner,
    TableScroll,
    Table,
    Th,
    ThDay,
    ThDayName,
    ThDayDate,
    Tr,
    TdHabit,
    HabitCellInner,
    HabitIconSpan,
    HabitNameSpan,
    Td,
    DayCellWrap,
    DayCheckBtn,
    DashCell,
    FutureCell,
    SummaryRow,
    SummaryCell,
    SummaryPct,
    LegendStrip,
    LegendItem,
    LegendDot,
    ModalOverlay,
    ModalBox,
    ModalTitle,
    ModalSubtitle,
    ModalTextarea,
    ModalActions,
    ModalBtn,
    colors,
} from "./style";

const pctColor = (pct) => {
    if (pct === null || pct === undefined) return colors.textMuted;
    if (pct >= 70) return colors.success;
    if (pct >= 40) return colors.amber;
    return colors.danger;
};

const rangeLabel = (weekId) => {
    const monday = getMondayOfISOWeek(weekId);
    if (!monday) return weekId;
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const sameMonth = monday.getMonth() === sunday.getMonth();
    const startLabel = monday.toLocaleDateString("uz-UZ", {
        day: "numeric",
        month: sameMonth ? undefined : "long",
    });
    const endLabel = sunday.toLocaleDateString("uz-UZ", { day: "numeric", month: "long" });
    return `${startLabel} – ${endLabel}`;
};

// Holat tsikli: null -> "done" -> "missed" -> "excused" -> null
const nextState = (current) => {
    if (!current) return "done";
    if (current === "done") return "missed";
    if (current === "missed") return "excused";
    return null;
};

const stateIcon = (state) => {
    if (state === "done") return <CheckCircle2 size={14} color={colors.success} />;
    if (state === "missed") return <XCircle size={14} color={colors.danger} />;
    if (state === "excused") return <AlertCircle size={14} color={colors.amber} />;
    return null;
};

const History = () => {
    const { user } = useUser();
    const { routines, fetchRoutines } = useRoutine();
    const { weeks, loading, error, fetchWeeks, saveDayCompletion } = useWeeks();

    useEffect(() => {
        if (!user) return;
        fetchRoutines();
        fetchWeeks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const now = useMemo(() => new Date(), []);
    const todayDateStr = useMemo(() => getDateStr(now), [now]);
    const currentWeekId = useMemo(() => getISOWeekId(now), [now]);

    const totalHabitsCount = useMemo(() => dedupeRoutines(routines).length, [routines]);
    const allHabits = useMemo(() => dedupeRoutines(routines), [routines]);

    const sortedWeeks = useMemo(
        () => [...weeks].sort((a, b) => (b.weekId || "").localeCompare(a.weekId || "")),
        [weeks]
    );

    const [selectedWeekId, setSelectedWeekId] = useState(null);
    const selectedWeek = useMemo(
        () => weeks.find((w) => w.weekId === selectedWeekId) || null,
        [weeks, selectedWeekId]
    );
    const isCurrentWeek = selectedWeekId === currentWeekId;

    const [pendingCell, setPendingCell] = useState(null);
    const [actionError, setActionError] = useState(null);
    const [reasonModal, setReasonModal] = useState(null); // { dayKey, habit }
    const [reasonText, setReasonText] = useState("");

    // FIX: joriy hafta bo'lsa BARCHA odatlar uchun bugungi kungacha tahrirlash mumkin
    const isEditableDay = useCallback(
        (dayKey) => {
            if (!isCurrentWeek) return false;
            const dayDate = getDateForWeekDay(selectedWeekId, dayKey);
            if (!dayDate) return false;
            return getDateStr(dayDate) <= todayDateStr;
        },
        [isCurrentWeek, selectedWeekId, todayDateStr]
    );

    const isFutureDay = useCallback(
        (dayKey) => {
            const dayDate = getDateForWeekDay(selectedWeekId, dayKey);
            if (!dayDate) return false;
            return getDateStr(dayDate) > todayDateStr;
        },
        [selectedWeekId, todayDateStr]
    );

    // MUHIM TUZATISH: avval bu yerda selectedWeek.statuses[dayKey] (KUN darajasidagi
    // umumiy holat) tekshirilar edi — u kunga birinchi marta biror odat saqlangan
    // zahoti "mavjud" bo'lib qolar va SHU KUNGA tegishli boshqa, hech qachon
    // bosilmagan odatlar ham xato ravishda "bajarilmagan" (missed) bo'lib ko'rinar
    // edi. Endi holat FAQAT shu aniq odatga tegishli ma'lumotdan (completions va
    // reasons ichidagi per-habit yozuv) hisoblanadi — boshqa odatlarning holati
    // bunga ta'sir qilmaydi.
    const getCellState = useCallback(
        (dayKey, habit) => {
            const key = habitKey(habit);
            const completions = selectedWeek?.completions?.[dayKey] || [];
            if (completions.includes(key)) return "done";

            const entry = selectedWeek?.reasons?.[dayKey]?.[key];
            // Eski formatda reasons[dayKey][key] oddiy "excused" satri edi;
            // yangi formatda { status, note } obyekti — ikkalasini ham qo'llab-quvvatlaymiz.
            const status = typeof entry === "string" ? entry : entry?.status;
            if (status === "excused") return "excused";
            if (status === "missed") return "missed";

            return null; // hali bajarilmagan — hech narsa belgilanmagan
        },
        [selectedWeek]
    );

    const applyStateChange = useCallback(
        async ({ dayKey, habit, newState, note }) => {
            const key = habitKey(habit);
            const cellId = `${dayKey}:${key}`;
            if (pendingCell) return;

            const dayHabits = allHabits.filter(
                (h) => !h.days || h.days.length === 0 || h.days.includes(dayKey)
            );
            const existing = new Set(selectedWeek?.completions?.[dayKey] || []);

            if (newState === "done") {
                existing.add(key);
            } else {
                existing.delete(key);
            }
            const habitIds = Array.from(existing);

            const currentReasons = selectedWeek?.reasons || {};
            const dayReasons = { ...(currentReasons[dayKey] || {}) };
            if (newState === "missed") {
                dayReasons[key] = { status: "missed" };
            } else if (newState === "excused") {
                dayReasons[key] = { status: "excused", note: note || "" };
            } else {
                // "done" yoki null (hali bajarilmagan) — sabab yozuvi endi kerak emas
                delete dayReasons[key];
            }
            const nextReasons = { ...currentReasons, [dayKey]: dayReasons };

            setPendingCell(cellId);
            setActionError(null);
            try {
                await saveDayCompletion({
                    weekId: selectedWeekId,
                    dayKey,
                    habitIds,
                    reasons: nextReasons,
                    totalHabits: dayHabits.length,
                });
            } catch (err) {
                setActionError(
                    err.response?.data?.message || err.message || "Kunlik holatni saqlashda xatolik"
                );
            } finally {
                setPendingCell(null);
            }
        },
        [allHabits, pendingCell, selectedWeek, selectedWeekId, saveDayCompletion]
    );

    const handleCellClick = useCallback(
        (dayKey, habit) => {
            if (!isEditableDay(dayKey) || pendingCell) return;
            const currentState = getCellState(dayKey, habit);
            const next = nextState(currentState);
            if (next === "excused") {
                setReasonModal({ dayKey, habit });
                setReasonText("");
            } else {
                applyStateChange({ dayKey, habit, newState: next });
            }
        },
        [isEditableDay, pendingCell, getCellState, applyStateChange]
    );

    const handleReasonConfirm = useCallback(() => {
        if (!reasonModal) return;
        const { dayKey, habit } = reasonModal;
        applyStateChange({ dayKey, habit, newState: "excused", note: reasonText });
        setReasonModal(null);
        setReasonText("");
    }, [reasonModal, reasonText, applyStateChange]);

    const handleReasonCancel = useCallback(() => {
        setReasonModal(null);
        setReasonText("");
    }, []);

    const anyError = error || actionError;
    const initialLoading = loading && weeks.length === 0;

    return (
        <Wrapper>
            <Inner>
                <HeaderRow>
                    <Eyebrow>
                        <CalendarClock size={12} /> Ekspeditsiya arxivi
                    </Eyebrow>
                    <Title>Haftalik tarix</Title>
                    <Subtitle>
                        Har bir hafta — bir pog'ona. Joriy hafta ichida, bugungi kunga qadar
                        bo'lgan barcha kunlarni istalgan payt to'ldirishingiz mumkin.
                    </Subtitle>
                </HeaderRow>

                {anyError && <ErrorBanner>Xatolik yuz berdi: {anyError}</ErrorBanner>}

                {initialLoading ? (
                    <StatusText>YUKLANMOQDA...</StatusText>
                ) : !selectedWeekId ? (
                    <SectionCard>
                        <SectionHead>
                            <div>
                                <SectionTitle>Barcha haftalar</SectionTitle>
                                <SectionCaption>Batafsil ko'rish uchun haftani tanlang</SectionCaption>
                            </div>
                        </SectionHead>
                        {sortedWeeks.length === 0 ? (
                            <EmptyState>
                                <EmptyTitle>Hali kuzatilgan hafta yo'q</EmptyTitle>
                                <EmptySub>
                                    Dashboard'da odatlaringizni belgilashni boshlang — birinchi
                                    pog'ona shu yerda paydo bo'ladi.
                                </EmptySub>
                            </EmptyState>
                        ) : (
                            <WeekList>
                                {sortedWeeks.map((week) => {
                                    const pct = getWeekAvgPct(week, totalHabitsCount);
                                    const trackedDays = Object.keys(week.statuses || {}).length;
                                    const isCurrent = week.weekId === currentWeekId;
                                    return (
                                        <WeekRow key={week.id} type="button" onClick={() => setSelectedWeekId(week.weekId)}>
                                            <WeekRowMain>
                                                <WeekRange>{rangeLabel(week.weekId)}</WeekRange>
                                                <WeekIdTag>{week.weekId}</WeekIdTag>
                                                {isCurrent && <WeekBadgeCurrent>JORIY</WeekBadgeCurrent>}
                                            </WeekRowMain>
                                            <WeekTrackedTag>{trackedDays}/7 kun</WeekTrackedTag>
                                            <WeekPctBadge $color={pctColor(pct)}>
                                                {pct === null ? "—" : `${pct}%`}
                                            </WeekPctBadge>
                                        </WeekRow>
                                    );
                                })}
                            </WeekList>
                        )}
                    </SectionCard>
                ) : (
                    <>
                        <BackRow>
                            <BackButton type="button" onClick={() => setSelectedWeekId(null)}>
                                <ArrowLeft size={14} /> Barcha haftalarga qaytish
                            </BackButton>
                        </BackRow>

                        {isCurrentWeek && (
                            <NoticeBanner>
                                <Info size={16} color={colors.amber} style={{ flexShrink: 0, marginTop: 1 }} />
                                <div>
                                    Bu — <strong>joriy hafta</strong>. Dushanbadan bugungi kungacha bo'lgan
                                    barcha odatlarni istalgan payt belgilashingiz mumkin — kelgusi kunlar yopiq.
                                </div>
                            </NoticeBanner>
                        )}

                        <SectionCard>
                            <SectionHead>
                                <div>
                                    <SectionTitle>{rangeLabel(selectedWeekId)}</SectionTitle>
                                    <SectionCaption>{selectedWeekId}</SectionCaption>
                                </div>
                            </SectionHead>

                            <LegendStrip>
                                <LegendItem>
                                    <LegendDot $bg={colors.successSoft} $border={colors.success}>✓</LegendDot>
                                    Bajarildi
                                </LegendItem>
                                <LegendItem>
                                    <LegendDot $bg={colors.dangerSoft} $border={colors.danger}>✗</LegendDot>
                                    Bajarilmadi
                                </LegendItem>
                                <LegendItem>
                                    <LegendDot $bg={colors.amberSoft} $border={colors.amber}>!</LegendDot>
                                    Sababli bajarilmadi
                                </LegendItem>
                            </LegendStrip>

                            {allHabits.length === 0 ? (
                                <EmptySub>Hali faol odat yo'q — Routine bo'limidan qo'shing.</EmptySub>
                            ) : (
                                <TableScroll>
                                    <Table>
                                        <thead>
                                            <Tr>
                                                <Th>Odat</Th>
                                                {DAY_ORDER.map((dayKey, i) => {
                                                    const dayDate = getDateForWeekDay(selectedWeekId, dayKey);
                                                    const isToday = getDateStr(dayDate) === todayDateStr;
                                                    return (
                                                        <ThDay key={dayKey}>
                                                            <ThDayName $isToday={isToday}>{DAY_LABELS_UZ[i]}</ThDayName>
                                                            <ThDayDate>
                                                                {dayDate?.toLocaleDateString("uz-UZ", { day: "numeric", month: "short" })}
                                                            </ThDayDate>
                                                        </ThDay>
                                                    );
                                                })}
                                            </Tr>
                                        </thead>
                                        <tbody>
                                            {allHabits.map((habit) => (
                                                <Tr key={habit.id}>
                                                    <TdHabit>
                                                        <HabitCellInner>
                                                            {habit.icon && <HabitIconSpan>{habit.icon}</HabitIconSpan>}
                                                            <HabitNameSpan>{habit.title}</HabitNameSpan>
                                                        </HabitCellInner>
                                                    </TdHabit>
                                                    {DAY_ORDER.map((dayKey) => {
                                                        const scheduled =
                                                            !habit.days ||
                                                            habit.days.length === 0 ||
                                                            habit.days.includes(dayKey);

                                                        if (!scheduled) {
                                                            return (
                                                                <Td key={dayKey}><DashCell>–</DashCell></Td>
                                                            );
                                                        }
                                                        if (isFutureDay(dayKey)) {
                                                            return (
                                                                <Td key={dayKey}><FutureCell>KUTILM.</FutureCell></Td>
                                                            );
                                                        }

                                                        const editable = isEditableDay(dayKey);
                                                        const cellId = `${dayKey}:${habitKey(habit)}`;
                                                        const state = getCellState(dayKey, habit);
                                                        return (
                                                            <Td key={dayKey}>
                                                                <DayCellWrap>
                                                                    <DayCheckBtn
                                                                        type="button"
                                                                        $state={state}
                                                                        $pending={pendingCell === cellId}
                                                                        disabled={!editable || pendingCell !== null}
                                                                        onClick={() => handleCellClick(dayKey, habit)}
                                                                        title={
                                                                            !editable
                                                                                ? "Faqat joriy hafta tahrirlanadi"
                                                                                : state === "done"
                                                                                ? "Bosing → Bajarilmadi"
                                                                                : state === "missed"
                                                                                ? "Bosing → Sababli bajarilmadi"
                                                                                : state === "excused"
                                                                                ? "Bosing → Tozalash"
                                                                                : "Bosing → Bajarildi"
                                                                        }
                                                                    >
                                                                        {stateIcon(state)}
                                                                    </DayCheckBtn>
                                                                </DayCellWrap>
                                                            </Td>
                                                        );
                                                    })}
                                                </Tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </TableScroll>
                            )}

                            <SummaryRow>
                                <SummaryCell style={{ flex: "0 0 auto", minWidth: 160, textAlign: "left" }} />
                                {DAY_ORDER.map((dayKey) => {
                                    const hasData = selectedWeek?.statuses?.[dayKey] !== undefined;
                                    const executions = selectedWeek?.executions?.[dayKey] || 0;
                                    const pct =
                                        hasData && totalHabitsCount > 0
                                            ? Math.min(100, Math.round((executions / totalHabitsCount) * 100))
                                            : null;
                                    return (
                                        <SummaryCell key={dayKey}>
                                            <SummaryPct $color={pctColor(pct)}>{pct === null ? "—" : `${pct}%`}</SummaryPct>
                                        </SummaryCell>
                                    );
                                })}
                            </SummaryRow>
                        </SectionCard>
                    </>
                )}
            </Inner>

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
        </Wrapper>
    );
};

export default History;