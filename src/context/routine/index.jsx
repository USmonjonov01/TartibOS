import { createContext, useCallback, useContext, useReducer } from "react";
import { routineApi } from "../../axios";
import { useUser } from "../users";
import { filterByOwner } from "../../utils/ownership";
import { initialState, routineReducer } from "./reducer";

const RoutineContext = createContext(null);

export const RoutineProvider = ({ children }) => {
    const [state, dispatch] = useReducer(routineReducer, initialState);
    const { user } = useUser();

    const fetchRoutines = useCallback(async () => {
        if (!user) return [];
        dispatch({ type: "ROUTINE_LOADING" });
        try {
            const { data } = await routineApi.get("/routines");
            const routines = data.routines || data || [];
            dispatch({ type: "ROUTINE_SUCCESS", payload: routines });
            return routines;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Routine ma'lumotlarini olishda xatolik";
            dispatch({ type: "ROUTINE_ERROR", payload: message });
            throw err;
        }
    }, [user]);

    const createRoutine = async (payload) => {
        if (!user) throw new Error("Avval tizimga kiring");
        const { data } = await routineApi.post("/routines", payload);
        const newRoutine = data.routine || data;
        dispatch({ type: "ROUTINE_SUCCESS", payload: [...state.routines, newRoutine] });
        return newRoutine;
    };

    const updateRoutine = async (routine, payload) => {
        if (!user) throw new Error("Avval tizimga kiring");

        const { data } = await routineApi.put(`/routines/${routine.id}`, payload);
        const updatedRoutine = data.routine || data;

        dispatch({
            type: "ROUTINE_SUCCESS",
            payload: [
                ...state.routines.map((r) => (r.id === routine.id ? { ...r, retired: true, active: false } : r)),
                updatedRoutine,
            ],
        });
        return updatedRoutine;
    };

    const removeRoutine = async (routine) => {
        if (!user) throw new Error("Avval tizimga kiring");
        await routineApi.delete(`/routines/${routine.id}`);
        dispatch({
            type: "ROUTINE_SUCCESS",
            payload: state.routines.filter((r) => r.id !== routine.id),
        });
    };

    return (
        <RoutineContext.Provider
            value={{ ...state, fetchRoutines, createRoutine, updateRoutine, removeRoutine }}
        >
            {children}
        </RoutineContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components -- context + hook birga joylashgan, bu keng tarqalgan pattern
export const useRoutine = () => {
    const ctx = useContext(RoutineContext);
    if (!ctx) {
        throw new Error("useRoutine faqat RoutineProvider ichida ishlatilishi kerak");
    }
    return ctx;
};