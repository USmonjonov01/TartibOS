import { getISOWeekId } from "./date";
import { dedupeRoutines, habitKey } from "./routine";

// Berilgan hafta yozuvi (weeks.executions/statuses) bo'yicha o'rtacha ijro foizini
// hisoblaydi. FAQAT haqiqatda kuzatilgan (statuses mavjud bo'lgan) kunlar hisobga
// olinadi — hali belgilanmagan kunlar 0% deb hisoblanmaydi, aks holda foiz
// sun'iy pasayib ketardi. Kuzatilgan kun bo'lmasa — null (ma'lumot yo'q).
export const getWeekAvgPct = (week, totalHabitsCount) => {
    if (!week || !totalHabitsCount) return null;
    const trackedDays = Object.keys(week.statuses || {});
    if (trackedDays.length === 0) return null;

    const sum = trackedDays.reduce((acc, dayKey) => {
        const executions = week.executions?.[dayKey] || 0;
        return acc + Math.min(100, Math.round((executions / totalHabitsCount) * 100));
    }, 0);
    return Math.round(sum / trackedDays.length);
};

export const getTrackedDaysCount = (week) => (week ? Object.keys(week.statuses || {}).length : 0);

export const getFullyDoneDaysCount = (week) =>
    week ? Object.values(week.statuses || {}).filter((s) => s === "completed").length : 0;

// Har bir faol odat uchun real bajarilish foizi: barcha yuklab olingan hafta
// yozuvlari bo'yicha, shu odat rejalashtirilgan (habit.days) VA haqiqatda
// kuzatilgan (statuses mavjud) kunlar sanaladi ("scheduled"), shulardan
// nechtasida odat completions ro'yxatida bo'lgani ("completed"). Hech qachon
// kuzatilmagan odat uchun rate === null qaytariladi (0% emas — bu muhim farq,
// aks holda yangi qo'shilgan odat "eng yomon" bo'lib ko'rinardi).
export const getHabitRates = (routines, weeks) => {
    const habits = dedupeRoutines(routines);

    const rates = habits.map((habit) => {
        const key = habitKey(habit);
        const days = habit.days || [];
        let scheduled = 0;
        let completed = 0;
        let totalScore = 0;
        let scoreCount = 0;

        weeks.forEach((week) => {
            const statuses = week.statuses || {};
            const completions = week.completions || {};
            const scores = week.scores || {};

            Object.keys(statuses).forEach((dayKey) => {
                if (days && days.length > 0 && !days.includes(dayKey)) return;
                scheduled += 1;
                if ((completions[dayKey] || []).includes(key)) {
                    completed += 1;
                    const score = scores[dayKey]?.[key];
                    if (typeof score === "number" && score >= 1 && score <= 10) {
                        totalScore += score;
                        scoreCount += 1;
                    }
                }
            });
        });

        const avgScore = scoreCount > 0 ? Number((totalScore / scoreCount).toFixed(1)) : null;

        return {
            id: habit.id,
            title: habit.title,
            category: habit.category,
            icon: habit.icon,
            days: habit.days,
            dayPlans: habit.dayPlans,
            scheduled,
            completed,
            rate: scheduled > 0 ? Math.round((completed / scheduled) * 100) : null,
            avgScore,
        };
    });

    return rates.sort((a, b) => (b.rate ?? -1) - (a.rate ?? -1));
};

// Missiyalarni haftaga ko'ra guruhlaydi. Bu yerda mission.scope'ga MUTLAQO
// e'tibor berilmaydi — faqat mission.date qaysi ISO haftaga tushishiga
// qaraladi. Shu sabab "bugun/kelgusi/haftalik" doirasidan tashqaridagi yoki
// scope maydoni bo'lmagan qo'shimcha (ekstra) missiyalar ham avtomatik
// hisobga qo'shiladi.
export const getMissionStatsForWeek = (missions, weekId) => {
    const inWeek = missions.filter((m) => {
        if (!m.date) return false;
        return getISOWeekId(new Date(m.date)) === weekId;
    });
    const completed = inWeek.filter((m) => m.completed).length;
    return {
        total: inWeek.length,
        completed,
        rate: inWeek.length > 0 ? Math.round((completed / inWeek.length) * 100) : null,
    };
};

// Barcha vaqt bo'yicha (jami) missiya bajarilish statistikasi — scope'siz
export const getMissionStatsTotal = (missions) => {
    const completed = missions.filter((m) => m.completed).length;
    return {
        total: missions.length,
        completed,
        rate: missions.length > 0 ? Math.round((completed / missions.length) * 100) : null,
    };
};

export const getMissionPriorityBreakdown = (missions) => {
    const counts = { yuqori: 0, ortacha: 0, past: 0 };
    missions.forEach((m) => {
        if (counts[m.priority] !== undefined) counts[m.priority] += 1;
    });
    const total = counts.yuqori + counts.ortacha + counts.past;
    return { counts, total };
};

// So'nggi N ta hafta yozuvi (weekId bo'yicha xronologik tartiblangan) uchun
// o'rtacha ijro trendini qaytaradi — faqat haqiqiy kuzatilgan haftalar
export const getWeeklyTrend = (weeks, totalHabitsCount, limit = 8) => {
    return [...weeks]
        .sort((a, b) => (a.weekId || "").localeCompare(b.weekId || ""))
        .map((week) => ({ weekId: week.weekId, pct: getWeekAvgPct(week, totalHabitsCount) }))
        .filter((w) => w.pct !== null)
        .slice(-limit);
};