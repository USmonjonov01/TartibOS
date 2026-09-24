import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { routineApi } from "../../axios";
import { useUser } from "../users";
import { filterByOwner } from "../../utils/ownership";
import { initialState, weeksReducer } from "./reducer";

const WeeksContext = createContext(null);

export const WeeksProvider = ({ children }) => {
    const [state, dispatch] = useReducer(weeksReducer, initialState);
    const { user } = useUser();

    useEffect(() => {
        // User almashganda (logout → yangi ro'yxatdan o'tish, sahifa yangilanmasdan) oldingi
        // foydalanuvchi ma'lumoti yangisiga ko'rinib, bildirishnomalarni ham buzmasligi uchun tozalaymiz.
        dispatch({ type: "WEEKS_RESET" });
    }, [user?.id]);

    const fetchWeeks = useCallback(async () => {
        if (!user) return [];
        dispatch({ type: "WEEKS_LOADING" });
        try {
            const { data } = await routineApi.get("/weeks");
            const weeksList = data.weeks || data || [];
            dispatch({ type: "WEEKS_SUCCESS", payload: weeksList });
            return weeksList;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Haftalik ma'lumotlarni olishda xatolik";
            dispatch({ type: "WEEKS_ERROR", payload: message });
            throw err;
        }
    }, [user]);

    const saveDayCompletion = useCallback(
        async ({ weekId, dayKey, habitIds, scores, reasons, totalHabits }) => {
            if (!user) throw new Error("Avval tizimga kiring");

            const { data } = await routineApi.put(
                "/weeks/day",
                {
                    weekId,
                    dayKey,
                    habitIds: habitIds || [],
                    scores: scores || {},
                    reasons: reasons,
                    totalHabits: totalHabits || 0,
                },
                { meta: { label: "Kunlik belgilash" } }
            );

            const updatedWeek = data.week || data;
            const existingIndex = state.weeks.findIndex((w) => w.id === updatedWeek.id || w.weekId === updatedWeek.weekId);

            let updatedList;
            if (existingIndex >= 0) {
                updatedList = state.weeks.map((w, idx) => (idx === existingIndex ? updatedWeek : w));
            } else {
                updatedList = [...state.weeks, updatedWeek];
            }

            dispatch({ type: "WEEKS_SUCCESS", payload: updatedList });
            return updatedWeek;
        },
        [user, state.weeks]
    );

    // Berilgan hafta uchun AI'dan haftalik xulosa so'raydi (server bu haftaning
    // odat/missiya/maqsad statistikasini o'zi hisoblab, AI'ga yuboradi va
    // natijani Week.conclusion'ga saqlaydi). "Sharh" sahifasidagi "AI bilan
    // tahlil qilish" tugmasi shu funksiyani chaqiradi — bundan tashqari,
    // backend har hafta oxirida (Dushanba 00:00, foydalanuvchi timezone'ida)
    // buni AVTOMATIK ham bajaradi, shuning uchun ko'p hollarda foydalanuvchi
    // sahifaga kirganda xulosa allaqachon tayyor turadi.
    const generateWeeklyConclusion = useCallback(
        async (weekId) => {
            if (!user) throw new Error("Avval tizimga kiring");

            const { data } = await routineApi.post(
                `/weeks/${weekId}/conclusion`,
                {},
                { meta: { label: "Haftalik AI xulosa", silent: true } }
            );

            const updatedWeek = data.week || data;
            const existingIndex = state.weeks.findIndex((w) => w.id === updatedWeek.id || w.weekId === updatedWeek.weekId);

            let updatedList;
            if (existingIndex >= 0) {
                updatedList = state.weeks.map((w, idx) => (idx === existingIndex ? updatedWeek : w));
            } else {
                updatedList = [...state.weeks, updatedWeek];
            }

            dispatch({ type: "WEEKS_SUCCESS", payload: updatedList });
            return { week: updatedWeek, ai: data.ai };
        },
        [user, state.weeks]
    );

    return (
        <WeeksContext.Provider value={{ ...state, fetchWeeks, saveDayCompletion, generateWeeklyConclusion }}>
            {children}
        </WeeksContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components -- context + hook birga joylashgan, bu keng tarqalgan pattern
export const useWeeks = () => {
    const ctx = useContext(WeeksContext);
    if (!ctx) {
        throw new Error("useWeeks faqat WeeksProvider ichida ishlatilishi kerak");
    }
    return ctx;
};