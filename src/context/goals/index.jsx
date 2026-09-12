import { createContext, useCallback, useContext, useReducer } from "react";
import { goalApi } from "../../axios";
import { useUser } from "../users";
import { useNotifications } from "../notifications";
import { initialState, goalReducer } from "./reducer";

const GoalContext = createContext(null);

export const GoalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(goalReducer, initialState);
    const { user } = useUser();
    const { notifyGoalLevelUp } = useNotifications();

    const fetchGoals = useCallback(async () => {
        if (!user) return [];
        dispatch({ type: "GOAL_LOADING" });
        try {
            const { data } = await goalApi.get("/goals");
            dispatch({ type: "GOAL_SUCCESS", payload: data.goals || [] });
            dispatch({ type: "GOAL_LEVEL", payload: data.level ?? 1 });
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
        const { data } = await goalApi.post("/goals/generate", { title });
        return data.steps || [];
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

    // Bosqichni bajarilgan/bajarilmagan deb belgilaydi. Backend level'ni
    // ham yangilaydi va shu javobda qaytaradi — shuning uchun bu yerda
    // qayta fetchGoals() chaqirishga hojat yo'q, lokal state to'g'ridan-to'g'ri
    // yangilanadi.
    const toggleStep = async (goalId, stepId) => {
        const { data } = await goalApi.patch(`/goals/${goalId}/steps/${stepId}/toggle`);
        dispatch({
            type: "GOAL_SUCCESS",
            payload: state.goals.map((g) =>
                g.id === goalId
                    ? { ...g, steps: g.steps.map((s) => (s.id === stepId ? data.step : s)) }
                    : g
            ),
        });
        dispatch({ type: "GOAL_LEVEL", payload: data.level });
        if (data.leveledUp) {
            notifyGoalLevelUp(data.level, data.step?.stageLabel);
        }
        return data;
    };

    return (
        <GoalContext.Provider
            value={{
                ...state,
                fetchGoals,
                generateSteps,
                createGoal,
                updateGoal,
                deleteGoal,
                addStep,
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
