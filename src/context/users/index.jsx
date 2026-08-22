import { createContext, useContext, useEffect, useReducer } from "react";
import { authApi } from "../../axios";
import { initialState, userReducer } from "./reducer";

const UserContext = createContext(null);

const persistSession = (user, token) => {
    if (token) {
        localStorage.setItem("token", token);
    }
    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
    }
};

const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            try {
                dispatch({ type: "AUTH_SUCCESS", payload: JSON.parse(savedUser) });
            } catch {
                clearSession();
            }
        }

        if (token) {
            authApi
                .get("/auth/me")
                .then(({ data }) => {
                    if (data?.user) {
                        persistSession(data.user);
                        dispatch({ type: "AUTH_SUCCESS", payload: data.user });
                    }
                })
                .catch(() => {
                    clearSession();
                    dispatch({ type: "AUTH_LOGOUT" });
                });
        }
    }, []);

    const register = async ({ ism, email, parol, parol_check }) => {
        dispatch({ type: "AUTH_LOADING" });
        try {
            if (parol && parol_check && parol !== parol_check) {
                throw new Error("Parollar mos kelmadi");
            }

            const { data } = await authApi.post(
                "/auth/register",
                { ism, email, parol },
                { meta: { label: "Ro'yxatdan o'tish", silent: false } }
            );

            persistSession(data.user, data.token);
            dispatch({ type: "AUTH_SUCCESS", payload: data.user });
            return data.user;
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Ro'yxatdan o'tishda xatolik yuz berdi";
            dispatch({ type: "AUTH_ERROR", payload: message });
            throw err;
        }
    };

    const login = async ({ email, parol }) => {
        dispatch({ type: "AUTH_LOADING" });
        try {
            const { data } = await authApi.post(
                "/auth/login",
                { email, parol },
                { meta: { label: "Tizimga kirish", silent: false } }
            );

            persistSession(data.user, data.token);
            dispatch({ type: "AUTH_SUCCESS", payload: data.user });
            return data.user;
        } catch (err) {
            const message =
                err.response?.data?.message || err.message || "Kirishda xatolik yuz berdi";
            dispatch({ type: "AUTH_ERROR", payload: message });
            throw err;
        }
    };

    const logout = () => {
        clearSession();
        dispatch({ type: "AUTH_LOGOUT" });
    };

    const clearError = () => dispatch({ type: "AUTH_CLEAR_ERROR" });

    const updateProfile = async (changes) => {
        if (!state.user) throw new Error("Avval tizimga kiring");
        dispatch({ type: "AUTH_LOADING" });
        try {
            const { data } = await authApi.put(
                "/auth/me",
                changes,
                { meta: { label: "Profil" } }
            );
            persistSession(data.user);
            dispatch({ type: "AUTH_SUCCESS", payload: data.user });
            return data.user;
        } catch (err) {
            const message =
                err.response?.data?.message || err.message || "Profilni yangilashda xatolik";
            dispatch({ type: "AUTH_ERROR", payload: message });
            throw err;
        }
    };

    return (
        <UserContext.Provider
            value={{ ...state, register, login, logout, clearError, updateProfile }}
        >
            {children}
        </UserContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components -- context + hook birga joylashgan, bu keng tarqalgan pattern
export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error("useUser faqat UserProvider ichida ishlatilishi kerak");
    }
    return ctx;
};