import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { goalApi } from "../../axios";
import { useUser } from "../users";
import { useNotifications } from "../notifications";
import { initialState, goalReducer } from "./reducer";

const GoalContext = createContext(null);

// Level va unvon ENDI faqat shu bitta Goal'ning o'zidan hisoblanadi — boshqa
// Goal'lar bilan hech qachon aralashmaydi. Bir nechta Goal bo'lsa, har biri
// o'z Level'iga ega bo'ladi (masalan Goal A — Level 3, Goal B — Level 5,
// bir-birini bosib o'tmaydi).
export const getGoalLevel = (goal) => 1 + (goal?.steps || []).filter((s) => s.completed).length;

export const getGoalStage = (goal) => {
    const completed = [...(goal?.steps || [])]
        .filter((s) => s.completed && s.completedAt)
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    return completed[0]?.stageLabel || null;
};

// Dashboard header'da ko'rsatish uchun "asosiy" Goal — faol Goal'lar orasida
// eng kichik `order`ga ega bo'lgani (ya'ni birinchi yaratilgan/eng tepadagi).
// Bir nechta Goal bo'lsa ham, header faqat BITTASINI ko'rsatadi — qolganlari
// Yo'l xaritasi sahifasida, har biri o'zining mustaqil Level/unvoni bilan.
export const getPrimaryGoal = (goals) => {
    const active = (goals || []).filter((g) => g.status !== "archived");
    if (active.length === 0) return null;
    return [...active].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0];
};

export const GoalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(goalReducer, initialState);
    const { user } = useUser();
    const { notifyGoalLevelUp } = useNotifications();

    useEffect(() => {
        // User almashganda (logout → yangi ro'yxatdan o'tish, sahifa yangilanmasdan) oldingi
        // foydalanuvchi ma'lumoti yangisiga ko'rinib, bildirishnomalarni ham buzmasligi uchun tozalaymiz.
        dispatch({ type: "GOAL_RESET" });
    }, [user?.id]);

    const fetchGoals = useCallback(async () => {
        if (!user) return [];
        dispatch({ type: "GOAL_LOADING" });
        try {
            const { data } = await goalApi.get("/goals");
            dispatch({ type: "GOAL_SUCCESS", payload: data.goals || [] });
            return data.goals || [];
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Maqsadlarni olishda xatolik";
            dispatch({ type: "GOAL_ERROR", payload: message });
            throw err;
        }
    }, [user]);

    // AI'ga maqsad nomini yuborib, taklif qilingan bosqichlar ro'yxatini oladi.
    // Hech narsani saqlamaydi — faqat preview uchun. Xato bo'lsa (masalan API
    // kaliti sozlanmagan), Error tashlaydi — chaqiruvchi tomon "bo'sh, o'zim
    // qo'shaman"ga tushib qolishi kerak.
    const generateSteps = useCallback(async (title) => {
        const { data } = await goalApi.post(
            "/goals/generate",
            { title },
            { meta: { label: "AI yo'l xaritasi", silent: true } }
        );
        return data.steps || [];
    }, []);

    // Maqsadga mos kun tartibini AI tuzadi va serverning o'zi Routine
    // yozuvlari sifatida SAQLAYDI (preview yo'q — foydalanuvchi oldindan
    // tasdiqlagan bo'ladi). Yaratilgan odatlar ro'yxatini qaytaradi.
    // Routine sahifasi/Dashboard o'z holatini fetchRoutines() orqali yangilaydi.
    const generateRoutine = useCallback(async (goalId, { dailyHours } = {}) => {
        const { data } = await goalApi.post(
            `/goals/${goalId}/routine`,
            { dailyHours },
            { meta: { label: "AI kun tartibi", silent: true } }
        );
        return data.routines || [];
    }, []);

    const createGoal = async (payload) => {
        const { data } = await goalApi.post("/goals", payload);
        dispatch({ type: "GOAL_SUCCESS", payload: [...state.goals, data.goal] });
        return data.goal;
    };

    const updateGoal = async (goalId, payload) => {
        const { data } = await goalApi.put(`/goals/${goalId}`, payload);
        dispatch({
            type: "GOAL_SUCCESS",
            payload: state.goals.map((g) => (g.id === goalId ? data.goal : g)),
        });
        return data.goal;
    };

    const deleteGoal = async (goalId) => {
        await goalApi.delete(`/goals/${goalId}`);
        dispatch({ type: "GOAL_SUCCESS", payload: state.goals.filter((g) => g.id !== goalId) });
    };

    const addStep = async (goalId, payload) => {
        const { data } = await goalApi.post(`/goals/${goalId}/steps`, payload);
        dispatch({
            type: "GOAL_SUCCESS",
            payload: state.goals.map((g) =>
                g.id === goalId ? { ...g, steps: [...g.steps, data.step] } : g
            ),
        });
        return data.step;
    };

    const updateStep = async (goalId, stepId, payload) => {
        const { data } = await goalApi.put(`/goals/${goalId}/steps/${stepId}`, payload);
        dispatch({
            type: "GOAL_SUCCESS",
            payload: state.goals.map((g) =>
                g.id === goalId
                    ? { ...g, steps: g.steps.map((s) => (s.id === stepId ? data.step : s)) }
                    : g
            ),
        });
        return data.step;
    };

    const deleteStep = async (goalId, stepId) => {
        await goalApi.delete(`/goals/${goalId}/steps/${stepId}`);
        dispatch({
            type: "GOAL_SUCCESS",
            payload: state.goals.map((g) =>
                g.id === goalId ? { ...g, steps: g.steps.filter((s) => s.id !== stepId) } : g
            ),
        });
    };

    // Bosqichni bajarilgan/bajarilmagan deb belgilaydi. Level backend'da
    // saqlanmaydi — shu Goal'ning yangilangan steps ro'yxatidan to'g'ridan-to'g'ri
    // hisoblanadi, shuning uchun "level up" bildirishnomasi ham AYNAN shu
    // Goal'ning o'z Level'i va o'z unvoni bilan chiqadi, boshqa Goal'larga
    // taalluqli emas.
    const toggleStep = async (goalId, stepId) => {
        // Server "bosqichlar ketma-ket bajarilishi kerak" kabi qoidani buzganda
        // 409 qaytaradi — bu xabar goalApi'ga ulangan networkNotifier orqali
        // allaqachon avtomatik toast sifatida ko'rsatiladi (src/axios/index.jsx).
        // Bu yerda faqat local state'ni buzilishdan saqlaymiz va xatoni
        // chaqiruvchiga (masalan optimistik UI kerak bo'lsa) uzatamiz.
        let data;
        try {
            ({ data } = await goalApi.patch(`/goals/${goalId}/steps/${stepId}/toggle`));
        } catch (err) {
            return { error: true, status: err.response?.status };
        }

        const updatedGoals = state.goals.map((g) =>
            g.id === goalId
                ? { ...g, steps: g.steps.map((s) => (s.id === stepId ? data.step : s)) }
                : g
        );
        dispatch({ type: "GOAL_SUCCESS", payload: updatedGoals });

        if (data.leveledUp) {
            const updatedGoal = updatedGoals.find((g) => g.id === goalId);
            notifyGoalLevelUp(getGoalLevel(updatedGoal), data.step?.stageLabel);
        }
        return data;
    };

    return (
        <GoalContext.Provider
            value={{
                ...state,
                fetchGoals,
                generateSteps,
                generateRoutine,
                createGoal,
                updateGoal,
                deleteGoal,
                addStep,
                updateStep,
                deleteStep,
                toggleStep,
            }}
        >
            {children}
        </GoalContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components -- context + hook birga joylashgan, bu keng tarqalgan pattern
export const useGoals = () => {
    const ctx = useContext(GoalContext);
    if (!ctx) {
        throw new Error("useGoals faqat GoalProvider ichida ishlatilishi kerak");
    }
    return ctx;
};