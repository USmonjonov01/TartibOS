import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, NotebookPen } from "lucide-react";
import { useUser } from "../../context/users";
import { useRoutine } from "../../context/routine";
import { useWeeks } from "../../context/weaks";
import { dailyReviewApi, missionApi } from "../../axios";
import { filterByOwner } from "../../utils/ownership";
import { dedupeRoutines } from "../../utils/routine";
import { getDateStr, getISOWeekId } from "../../utils/date";
import { getWeekAvgPct, getMissionStatsForWeek, getHabitRates } from "../../utils/stats";
import {
    Wrapper,
    Inner,
    HeaderRow,
    Eyebrow,
    Title,
    Subtitle,
    StatusText,
    ErrorBanner,
    ModeTabs,
    ModeTab,
    InfoBanner,
    InfoBannerLabel,
    InfoBannerDate,
    ScoreGrid,
    ScoreCard,
    ScoreCardLabel,
    ScoreCardSub,
    ScoreButtonsRow,
    ScoreButton,
    ScoreResultLabel,
    FieldStack,
    Field,
    FieldLabel,
    Textarea,
    AutoInsightBox,
    AutoInsightLabel,
    InsightList,
    InsightItem,
    InsightMarker,
    ActionsRow,
    SaveButton,
    ClearButton,
    colors,
} from "./style";

const SCORE_LABELS = ["", "Juda past", "Past", "O'rtacha", "Yaxshi", "Cho'qqida"];
const SCORE_COLORS = ["", colors.danger, "#D98276", colors.amber, colors.success, colors.amberStrong];

const emptyDaily = { achievement: "", mistake: "", summary: "", nextFocus: "", discipline: 0, execution: 0 };
const emptyWeekly = { discipline: 0, execution: 0, missionRate: 0, habitConsistency: 0, reflection: "" };

const mondayOf = (date) => {
    const d = new Date(date);
    const day = d.getDay() || 7;
    if (day !== 1) d.setDate(d.getDate() - day + 1);
    d.setHours(0, 0, 0, 0);
    return d;
};

const ScoreField = ({ label, sublabel, value, onChange }) => (
    <ScoreCard>
        <ScoreCardLabel>{label}</ScoreCardLabel>
        <ScoreCardSub>{sublabel}</ScoreCardSub>
        <ScoreButtonsRow>
            {[1, 2, 3, 4, 5].map((n) => (
                <ScoreButton
                    key={n}
                    type="button"
                    $active={value === n}
                    $color={SCORE_COLORS[n]}
                    onClick={() => onChange(n)}
                >
                    {n}
                </ScoreButton>
            ))}
        </ScoreButtonsRow>
        {value > 0 && <ScoreResultLabel $color={SCORE_COLORS[value]}>{SCORE_LABELS[value]}</ScoreResultLabel>}
    </ScoreCard>
);

const ReviewField = ({ label, placeholder, value, onChange, rows }) => (
    <Field>
        <FieldLabel>{label}</FieldLabel>
        <Textarea placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} rows={rows} />
    </Field>
);

const Review = () => {
    const { user } = useUser();
    const { routines, fetchRoutines } = useRoutine();
    const { weeks, fetchWeeks } = useWeeks();

    const [missions, setMissions] = useState([]);
    const fetchMissions = useCallback(async () => {
        if (!user) return;
        try {
            const { data } = await missionApi.get("/missions");
            const list = data.missions || data || [];
            setMissions(Array.isArray(list) ? list.filter((m) => !m.cancelled && !m.__container) : []);
        } catch {
            // Haftalik auto-tahlil ixtiyoriy — missiya ma'lumoti kelmasa ham review sahifasi ishlashda davom etadi
        }
    }, [user]);

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState(null);
    const [saveError, setSaveError] = useState(null);

    const fetchReviews = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setLoadError(null);
        try {
            const { data } = await dailyReviewApi.get("/reviews");
            const list = data.reviews || data || [];
            setReviews(Array.isArray(list) ? list : []);
        } catch (err) {
            setLoadError(
                err.response?.data?.message || err.message || "Review tarixini olishda xatolik"
            );
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;
        fetchRoutines();
        fetchWeeks();
        // eslint-disable-next-line react-hooks/set-state-in-effect -- montaj vaqtida ma'lumot olish, standart pattern
        fetchMissions();
        fetchReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const [mode, setMode] = useState("daily");
    const [saved, setSaved] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [daily, setDaily] = useState(emptyDaily);
    const [weekly, setWeekly] = useState(emptyWeekly);

    const now = useMemo(() => new Date(), []);
    const todayStr = useMemo(() => getDateStr(now), [now]);
    const currentWeekId = useMemo(() => getISOWeekId(now), [now]);
    const previousWeekId = useMemo(
        () => getISOWeekId(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)),
        [now]
    );

    const todayEntry = useMemo(
        () => reviews.find((r) => r.mode === "daily" && r.date === todayStr),
        [reviews, todayStr]
    );
    const weekEntry = useMemo(
        () => reviews.find((r) => r.mode === "weekly" && r.weekId === currentWeekId),
        [reviews, currentWeekId]
    );

    // Serverdan kelgan yozuvni forma holatiga sinxronlaymiz — faqat entry ID
    // o'zgarganda (birinchi yuklanganda yoki save qilingandan keyin). Bu Dashboard
    // sahifasidagi serverHabitIds/syncedServerIds bilan bir xil pattern: effect
    // ichida emas, render vaqtida taqqoslab moslashtiriladi, shunda foydalanuvchi
    // hozir yozayotgan matn har render'da qayta yozib qo'yilmaydi.
    const dailyEntryId = todayEntry?.id ?? null;
    const [syncedDailyId, setSyncedDailyId] = useState(dailyEntryId);
    if (dailyEntryId !== syncedDailyId) {
        setSyncedDailyId(dailyEntryId);
        setDaily(
            todayEntry
                ? {
                      achievement: todayEntry.achievement || "",
                      mistake: todayEntry.mistake || "",
                      summary: todayEntry.summary || "",
                      nextFocus: todayEntry.nextFocus || "",
                      discipline: todayEntry.discipline || 0,
                      execution: todayEntry.execution || 0,
                  }
                : emptyDaily
        );
    }

    const weeklyEntryId = weekEntry?.id ?? null;
    const [syncedWeeklyId, setSyncedWeeklyId] = useState(weeklyEntryId);
    if (weeklyEntryId !== syncedWeeklyId) {
        setSyncedWeeklyId(weeklyEntryId);
        setWeekly(
            weekEntry
                ? {
                      discipline: weekEntry.discipline || 0,
                      execution: weekEntry.execution || 0,
                      missionRate: weekEntry.missionRate || 0,
                      habitConsistency: weekEntry.habitConsistency || 0,
                      reflection: weekEntry.reflection || "",
                  }
                : emptyWeekly
        );
    }

    const todayLabel = useMemo(
        () => now.toLocaleDateString("uz-UZ", { weekday: "long", day: "numeric", month: "long" }),
        [now]
    );
    const weekStartLabel = useMemo(
        () => mondayOf(now).toLocaleDateString("uz-UZ", { day: "numeric", month: "long" }),
        [now]
    );

    // Haftalik auto-tahlil — Statistics sahifasidagi kabi FAQAT haqiqiy
    // hisoblangan qiymatlardan, hech qanday statik/soxta matn yo'q.
    const totalHabitsCount = useMemo(() => dedupeRoutines(routines).length, [routines]);
    const currentWeek = useMemo(() => weeks.find((w) => w.weekId === currentWeekId), [weeks, currentWeekId]);
    const previousWeek = useMemo(() => weeks.find((w) => w.weekId === previousWeekId), [weeks, previousWeekId]);
    const currentPct = useMemo(() => getWeekAvgPct(currentWeek, totalHabitsCount), [currentWeek, totalHabitsCount]);
    const previousPct = useMemo(
        () => getWeekAvgPct(previousWeek, totalHabitsCount),
        [previousWeek, totalHabitsCount]
    );
    const missionCurrent = useMemo(() => getMissionStatsForWeek(missions, currentWeekId), [missions, currentWeekId]);
    const habitRates = useMemo(
        () => getHabitRates(routines, weeks).filter((h) => h.scheduled > 0),
        [routines, weeks]
    );
    const weakestHabit = habitRates.length ? habitRates[habitRates.length - 1] : null;

    const autoInsights = useMemo(() => {
        const list = [];
        if (currentPct !== null && previousPct !== null) {
            const delta = currentPct - previousPct;
            const direction = delta > 0 ? "oshdi" : delta < 0 ? "pasaydi" : "o'zgarmadi";
            list.push(
                <>
                    Bu hafta intizom ko'rsatkichi o'tgan haftaga nisbatan{" "}
                    <strong>
                        {delta > 0 ? "+" : ""}
                        {delta}%
                    </strong>{" "}
                    {direction}.
                </>
            );
        } else if (currentPct !== null) {
            list.push(
                <>
                    Bu hafta o'rtacha ijro <strong>{currentPct}%</strong>.
                </>
            );
        }

        if (weakestHabit && weakestHabit.rate !== null && weakestHabit.rate < 70) {
            list.push(
                <>
                    <strong>{weakestHabit.title}</strong> odati faqat {weakestHabit.completed}/
                    {weakestHabit.scheduled} kun bajarildi — diqqat talab qiladi.
                </>
            );
        }

        if (missionCurrent.total > 0) {
            list.push(
                <>
                    <strong>
                        {missionCurrent.completed}/{missionCurrent.total}
                    </strong>{" "}
                    missiya ({missionCurrent.rate}%) shu hafta yakunlandi.
                </>
            );
        }

        return list;
    }, [currentPct, previousPct, weakestHabit, missionCurrent]);

    const saveReview = async () => {
        if (!user) return;
        setSubmitting(true);
        setSaveError(null);
        try {
            const payload = mode === "daily"
                ? {
                      date: todayStr,
                      win: daily.achievement || null,
                      mistake: daily.mistake || null,
                      summary: daily.summary || null,
                      tomorrow: daily.nextFocus || null,
                  }
                : {
                      date: todayStr,
                      summary: weekly.reflection || null,
                  };

            const { data } = await dailyReviewApi.post("/reviews", payload);
            const created = data.review || data;
            setReviews((prev) => [...prev, created]);

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setSaveError(err.response?.data?.message || err.message || "Reviewni saqlashda xatolik");
        } finally {
            setSubmitting(false);
        }
    };

    const clearCurrent = () => {
        if (mode === "daily") setDaily(emptyDaily);
        else setWeekly(emptyWeekly);
    };

    const switchMode = (m) => {
        setMode(m);
        setSaved(false);
        setSaveError(null);
    };

    const anyError = loadError || saveError;
    const initialLoading = loading && reviews.length === 0;

    return (
        <Wrapper>
            <Inner>
                <HeaderRow>
                    <Eyebrow>
                        <NotebookPen size={12} /> Kundalik jurnal
                    </Eyebrow>
                    <Title>Review</Title>
                    <Subtitle>Refleksiya va tahlil — kunning yoki haftaning yakuni bilan yuzlashing.</Subtitle>
                </HeaderRow>

                {anyError && <ErrorBanner>Xatolik yuz berdi: {anyError}</ErrorBanner>}

                <ModeTabs>
                    <ModeTab type="button" $active={mode === "daily"} onClick={() => switchMode("daily")}>
                        Kunlik review
                    </ModeTab>
                    <ModeTab type="button" $active={mode === "weekly"} onClick={() => switchMode("weekly")}>
                        Haftalik review
                    </ModeTab>
                </ModeTabs>

                {initialLoading ? (
                    <StatusText>YUKLANMOQDA...</StatusText>
                ) : mode === "daily" ? (
                    <>
                        <InfoBanner>
                            <InfoBannerLabel>Bugungi review</InfoBannerLabel>
                            <InfoBannerDate>{todayLabel}</InfoBannerDate>
                        </InfoBanner>

                        <ScoreGrid>
                            <ScoreField
                                label="Bugungi intizom"
                                sublabel="Rejaga qanchalik amal qildingiz?"
                                value={daily.discipline}
                                onChange={(v) => setDaily((d) => ({ ...d, discipline: v }))}
                            />
                            <ScoreField
                                label="Bugungi ijro"
                                sublabel="Ishlarni qanchalik bajardingiz?"
                                value={daily.execution}
                                onChange={(v) => setDaily((d) => ({ ...d, execution: v }))}
                            />
                        </ScoreGrid>

                        <FieldStack>
                            <ReviewField
                                label="Bugungi eng katta yutuq"
                                placeholder="Bugun nimaga eng ko'p iftixor qildingiz?"
                                value={daily.achievement}
                                onChange={(v) => setDaily((d) => ({ ...d, achievement: v }))}
                                rows={2}
                            />
                            <ReviewField
                                label="Bugungi eng katta xato"
                                placeholder="Nimada yaxshilanishingiz kerak edi?"
                                value={daily.mistake}
                                onChange={(v) => setDaily((d) => ({ ...d, mistake: v }))}
                                rows={2}
                            />
                            <ReviewField
                                label="Bugungi xulosa"
                                placeholder="Bugun nima o'rgandingiz?"
                                value={daily.summary}
                                onChange={(v) => setDaily((d) => ({ ...d, summary: v }))}
                                rows={3}
                            />
                            <ReviewField
                                label="Ertangi asosiy fokus"
                                placeholder="Ertaga birinchi navbatda nima qilasiz?"
                                value={daily.nextFocus}
                                onChange={(v) => setDaily((d) => ({ ...d, nextFocus: v }))}
                                rows={2}
                            />
                        </FieldStack>
                    </>
                ) : (
                    <>
                        <InfoBanner>
                            <InfoBannerLabel>Haftalik review</InfoBannerLabel>
                            <InfoBannerDate>{weekStartLabel}dan boshlab</InfoBannerDate>
                        </InfoBanner>

                        <ScoreGrid>
                            <ScoreField
                                label="Haftalik intizom"
                                sublabel="Umumiy intizom darajasi"
                                value={weekly.discipline}
                                onChange={(v) => setWeekly((w) => ({ ...w, discipline: v }))}
                            />
                            <ScoreField
                                label="Haftalik ijro"
                                sublabel="Vazifalar ijrosi"
                                value={weekly.execution}
                                onChange={(v) => setWeekly((w) => ({ ...w, execution: v }))}
                            />
                            <ScoreField
                                label="Missiya bajarish"
                                sublabel="Missiyalar foizi"
                                value={weekly.missionRate}
                                onChange={(v) => setWeekly((w) => ({ ...w, missionRate: v }))}
                            />
                            <ScoreField
                                label="Odat izchilligi"
                                sublabel="Odatlar muntazamligi"
                                value={weekly.habitConsistency}
                                onChange={(v) => setWeekly((w) => ({ ...w, habitConsistency: v }))}
                            />
                        </ScoreGrid>

                        <AutoInsightBox>
                            <AutoInsightLabel>Avtomatik tahlil</AutoInsightLabel>
                            {autoInsights.length === 0 ? (
                                <InsightItem>Hali yetarli ma'lumot yo'q — Dashboard'da odatlaringizni belgilang.</InsightItem>
                            ) : (
                                <InsightList>
                                    {autoInsights.map((text, i) => (
                                        <InsightItem key={i}>
                                            <InsightMarker>{String(i + 1).padStart(2, "0")}</InsightMarker>
                                            <div>{text}</div>
                                        </InsightItem>
                                    ))}
                                </InsightList>
                            )}
                        </AutoInsightBox>

                        <FieldStack>
                            <ReviewField
                                label="Erkin haftalik mulohaza"
                                placeholder="Bu hafta haqida xohlaganingizni yozing..."
                                value={weekly.reflection}
                                onChange={(v) => setWeekly((w) => ({ ...w, reflection: v }))}
                                rows={5}
                            />
                        </FieldStack>
                    </>
                )}

                <ActionsRow>
                    <SaveButton type="button" $saved={saved} $disabled={submitting} onClick={saveReview} disabled={submitting}>
                        {saved ? (
                            <>
                                <CheckCircle2 size={16} /> Saqlandi!
                            </>
                        ) : submitting ? (
                            "Saqlanmoqda..."
                        ) : (
                            "Reviewni saqlash"
                        )}
                    </SaveButton>
                    <ClearButton type="button" onClick={clearCurrent}>
                        <RotateCcw size={14} /> Tozalash
                    </ClearButton>
                </ActionsRow>
            </Inner>
        </Wrapper>
    );
};

export default Review;