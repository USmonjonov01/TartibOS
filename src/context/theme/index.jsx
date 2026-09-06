import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "tartibos-theme";

function getInitialTheme() {
    if (typeof window === "undefined") return "light";
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    // Saqlangan tanlov yo'q bo'lsa, tizim afzalligini hurmat qilamiz,
    // lekin TartibOS'ning standart holati — light.
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    return prefersDark ? "dark" : "light";
}

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        try {
            window.localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // localStorage mavjud bo'lmasa (masalan, ba'zi Telegram WebView
            // holatlarida) — jimgina o'tkazib yuboramiz, ilova ishlashda davom etadi
        }
    }, [theme]);

    const setTheme = useCallback((next) => {
        setThemeState(next === "dark" ? "dark" : "light");
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === "light" ? "dark" : "light"));
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme faqat <ThemeProvider> ichida ishlatilishi kerak");
    }
    return ctx;
}
