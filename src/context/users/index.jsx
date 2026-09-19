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
                .catch((error) => {
  const status = error.response?.status;

  if (status === 401) {
    clearSession();
    dispatch({ type: "AUTH_LOGOUT" });
    return;
  }

  // Network / timeout / 5xx:
  // SESSIONNI O'CHIRMAYMIZ
  console.error("Auth check failed:", error);

  dispatch({
    type: "AUTH_ERROR",
    payload: {
      type: "server",
      message: "Server bilan aloqa vaqtincha mavjud emas."
    }
  });
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

    // --- Parolni tiklash --------------------------------------------------
    // Bu ikkalasi ham hozirgi user holatiga (dispatch/AUTH_*) tegmaydi —
    // forgotPassword hali login qilinmagan holatda chaqiriladi, resetPassword
    // esa muvaffaqiyatli bo'lsa o'zi token+user qaytaradi va sessiyani ochadi.
    const forgotPassword = async (email) => {
        const { data } = await authApi.post(
            "/auth/forgot-password",
            { email },
            { meta: { label: "Parolni tiklash", silent: false } }
        );
        return data;
    };

    const resetPassword = async ({ token, parol }) => {
        const { data } = await authApi.post(
            "/auth/reset-password",
            { token, parol },
            { meta: { label: "Parolni tiklash", silent: false } }
        );
        persistSession(data.user, data.token);
        dispatch({ type: "AUTH_SUCCESS", payload: data.user });
        return data.user;
    };

    // --- Email tasdiqlash ---------------------------------------------------
    const verifyEmail = async (token) => {
        const { data } = await authApi.post(
            "/auth/verify-email",
            { token },
            { meta: { label: "Email tasdiqlash", silent: false } }
        );
        // Foydalanuvchi shu paytda tizimga kirgan bo'lishi mumkin (masalan
        // yangi oynada havolani ochgan) — shunday holatda mahalliy state'ni
        // ham darhol yangilaymiz, sahifani qayta yuklamasdan.
        if (state.user) {
            const updated = { ...state.user, emailVerified: true };
            persistSession(updated);
            dispatch({ type: "AUTH_SUCCESS", payload: updated });
        }
        return data;
    };

    const resendVerification = async () => {
        const { data } = await authApi.post(
            "/auth/resend-verification",
            {},
            { meta: { label: "Tasdiqlash xati", silent: false } }
        );
        return data;
    };

    // --- Google Sign-In -------------------------------------------------------
    // credential — Google Identity Services tugmasi qaytargan ID token (JWT).
    const loginWithGoogle = async (credential) => {
        dispatch({ type: "AUTH_LOADING" });
        try {
            const { data } = await authApi.post(
                "/auth/google",
                { credential },
                { meta: { label: "Google bilan kirish", silent: false } }
            );
            persistSession(data.user, data.token);
            dispatch({ type: "AUTH_SUCCESS", payload: data.user });
            return data.user;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Google bilan kirishda xatolik";
            dispatch({ type: "AUTH_ERROR", payload: message });
            throw err;
        }
    };

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
            value={{
                ...state,
                register,
                login,
                logout,
                clearError,
                updateProfile,
                forgotPassword,
                resetPassword,
                verifyEmail,
                resendVerification,
                loginWithGoogle,
            }}
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