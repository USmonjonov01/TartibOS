import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { App } from "antd";
import { useUser } from "../users";
import { useRoutine } from "../routine";
import { useWeeks } from "../weaks";
import { missionApi } from "../../axios";
import { filterByOwner } from "../../utils/ownership";
import { dedupeRoutines, getTodayHabits, habitKey } from "../../utils/routine";
import { getDateStr, getDayKey, getISOWeekId } from "../../utils/date";
import { getWeekAvgPct } from "../../utils/stats";
import { loadSeenKeys, saveSeenKeys, loadHistory, saveHistory } from "../../utils/notificationStore";

const NotificationsContext = createContext(null);

// Missiyalar fon rejimida shuncha millisekundda bir marta qayta tekshiriladi.
const POLL_MS = 45_000;

const TYPE_META = {
    "mission-due": { antType: "info", title: "⏰ Missiya vaqti keldi" },
    "mission-completed": { antType: "success", title: "✅ Missiya bajarildi" },
    "habit-missed": { antType: "warning", title: "⌛ Odat muddati o'tdi" },
    "level-up-day": { antType: "success", title: "🏆 Level Up!" },
    "level-up-week": { antType: "success", title: "🏆 Level Up!" },
};

// NotificationsProvider — ilovadagi "voqea"larga asoslangan bildirishnomalar:
//   1) Missiya uchun belgilangan vaqt keldi
//   2) Missiya bajarildi
//   3) Odat (habit) uchun belgilangan vaqt o'tib ketdi, hali bajarilmagan
//   4) Yangi rekord — bugungi natija kechagidan, yoki bu haftaniki o'tgan
//      haftadan yaxshi bo'lsa — "Level Up!"
//
// (1)-(3) fon rejimidagi tekshiruv (poll + har bir ma'lumot yangilanganda)
// orqali aniqlanadi, chunki bular vaqtga bog'liq. (4) esa routines/weeks
// state o'zgarganda deyarli zudlik bilan (event-driven) tekshiriladi — bu
// state RoutineProvider/WeeksProvider orqali butun ilova bo'ylab umumiy.
// (2) esa aniq ma'lum bir foydalanuvchi harakati bo'lgani uchun komponentlar
// (Dashboard, Missions) uni to'g'ridan-to'g'ri notifyMissionCompleted orqali chaqiradi.
export const NotificationsProvider = ({ children }) => {
    const { notification } = App.useApp();
    const { user } = useUser();
    const { routines, fetchRoutines } = useRoutine();
    const { weeks, fetchWeeks } = useWeeks();

    const [missions, setMissions] = useState([]);
    const [history, setHistory] = useState([]);

    const seenRef = useRef(loadSeenKeys());

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- foydalanuvchi almashganda saqlangan tarixni yuklaymiz, standart pattern
        setHistory(user ? loadHistory(user.id) : []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const pushNotification = useCallback(
        (type, { description, dedupeKey } = {}) => {
            if (dedupeKey) {
                if (seenRef.current.has(dedupeKey)) return;
                seenRef.current.add(dedupeKey);
                saveSeenKeys(seenRef.current);
            }

            const meta = TYPE_META[type] || { antType: "info", title: "Bildirishnoma" };
            const entry = {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                type,
                title: meta.title,
                description: description || "",
                time: new Date().toISOString(),
                read: false,
            };

            notification[meta.antType]({
                message: meta.title,
                description,
                placement: "topRight",
                duration: type.startsWith("level-up") ? 6 : 4.5,
            });

            setHistory((prev) => {
                const next = [entry, ...prev].slice(0, 30);
                if (user) saveHistory(user.id, next);
                return next;
            });
        },
        [notification, user]
    );

    // Ilovada umumiy MissionsContext yo'q (Dashboard/Missions/Statistics har
    // biri o'zicha mustaqil yuklaydi) — shu naqshga mos holda bu yerda ham
    // fon rejimida, jim (toast'siz) o'z nusxasini yuklaymiz.
    const fetchMissionsQuiet = useCallback(async () => {
        if (!user) return;
        try {
            const { data } = await missionApi.get("/missions", { meta: { silent: true } });
            setMissions(filterByOwner(data, user.id).filter((m) => !m.__container));
        } catch {
            // tarmoq xatosi MessagesProvider orqali allaqachon ko'rsatiladi
        }
    }, [user]);

    const runTimeChecks = useCallback(() => {
        if (!user) return;
        const now = new Date();
        const currentHHMM = now.toTimeString().slice(0, 5);
        const todayDateStr = getDateStr(now);
        const todayKey = getDayKey(now);
        const currentWeekId = getISOWeekId(now);

        missions
            .filter((m) => !m.cancelled && m.date === todayDateStr && !m.completed && m.start)
            .forEach((mission) => {
                if (currentHHMM < mission.start) return;
                pushNotification("mission-due", {
                    description: `"${mission.title}" — rejalashtirilgan vaqt keldi (${mission.start}).`,
                    dedupeKey: `mission-due:${user.id}:${mission.id}:${todayDateStr}`,
                });
            });

        const currentWeek = weeks.find((w) => w.weekId === currentWeekId);
        const completedToday = new Set(currentWeek?.completions?.[todayKey] || []);

        getTodayHabits(routines, now).forEach((habit) => {
            if (!habit.end || currentHHMM <= habit.end) return;
            if (completedToday.has(habitKey(habit))) return;
            pushNotification("habit-missed", {
                description: `"${habit.title}" uchun belgilangan vaqt (${habit.end}) o'tib ketdi, hali bajarilmagan.`,
                dedupeKey: `habit-missed:${user.id}:${habitKey(habit)}:${todayDateStr}`,
            });
        });
    }, [user, missions, weeks, routines, pushNotification]);

    const runRecordChecks = useCallback(() => {
        if (!user) return;
        const now = new Date();
        const todayKey = getDayKey(now);
        const currentWeekId = getISOWeekId(now);
        const previousWeekId = getISOWeekId(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const yesterdayKey = getDayKey(yesterday);
        const yesterdayWeekId = getISOWeekId(yesterday);

        const totalHabitsCount = dedupeRoutines(routines).length;
        if (!totalHabitsCount) return;

        const currentWeek = weeks.find((w) => w.weekId === currentWeekId);
        const yesterdayWeek = weeks.find((w) => w.weekId === yesterdayWeekId);
        const previousWeek = weeks.find((w) => w.weekId === previousWeekId);

        const todayExecutions = currentWeek?.executions?.[todayKey];
        const yesterdayExecutions = yesterdayWeek?.executions?.[yesterdayKey];

        if (todayExecutions !== undefined && yesterdayExecutions !== undefined) {
            const todayPct = Math.round((todayExecutions / totalHabitsCount) * 100);
            const yesterdayPct = Math.round((yesterdayExecutions / totalHabitsCount) * 100);
            if (todayPct > yesterdayPct) {
                pushNotification("level-up-day", {
                    description: `Bugungi ijro ${todayPct}% — kechagi ${yesterdayPct}%dan yaxshi natija!`,
                    dedupeKey: `level-up-day:${user.id}:${getDateStr(now)}`,
                });
            }
        }

        const currentWeekPct = getWeekAvgPct(currentWeek, totalHabitsCount);
        const previousWeekPct = getWeekAvgPct(previousWeek, totalHabitsCount);
        if (currentWeekPct !== null && previousWeekPct !== null && currentWeekPct > previousWeekPct) {
            pushNotification("level-up-week", {
                description: `Bu hafta o'rtacha ijro ${currentWeekPct}% — o'tgan hafta ${previousWeekPct}%dan yaxshi!`,
                dedupeKey: `level-up-week:${user.id}:${currentWeekId}`,
            });
        }
    }, [user, routines, weeks, pushNotification]);

    // Foydalanuvchi tizimga kirganda ma'lumotlarni tayyorlaymiz va muntazam yangilaymiz
    useEffect(() => {
        if (!user) return;
        fetchRoutines().catch(() => {});
        fetchWeeks().catch(() => {});
        // eslint-disable-next-line react-hooks/set-state-in-effect -- montaj vaqtida ma'lumot olish, standart pattern
        fetchMissionsQuiet();

        const interval = setInterval(fetchMissionsQuiet, POLL_MS);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    // routines/weeks/missions yangilanishi bilanoq tekshiruvni ishga tushiramiz —
    // shu sabab Level Up 45 soniya kutmasdan, deyarli zudlik bilan chiqadi.
    useEffect(() => {
        runTimeChecks();
        runRecordChecks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routines, weeks, missions]);

    const notifyMissionCompleted = useCallback(
        (mission) => {
            if (!user) return;
            pushNotification("mission-completed", {
                description: `"${mission.title}" muvaffaqiyatli bajarildi. Zo'r!`,
                dedupeKey: `mission-completed:${user.id}:${mission.id}:${getDateStr(new Date())}`,
            });
        },
        [pushNotification, user]
    );

    const markAllRead = useCallback(() => {
        setHistory((prev) => {
            const next = prev.map((n) => ({ ...n, read: true }));
            if (user) saveHistory(user.id, next);
            return next;
        });
    }, [user]);

    const unreadCount = useMemo(() => history.filter((n) => !n.read).length, [history]);

    const value = useMemo(
        () => ({ history, unreadCount, markAllRead, notifyMissionCompleted }),
        [history, unreadCount, markAllRead, notifyMissionCompleted]
    );

    return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components -- context + hook birga joylashgan, bu keng tarqalgan pattern
export const useNotifications = () => {
    const ctx = useContext(NotificationsContext);
    if (!ctx) {
        throw new Error("useNotifications faqat NotificationsProvider ichida ishlatilishi kerak");
    }
    return ctx;
};
