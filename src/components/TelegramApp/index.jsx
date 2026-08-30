import { useEffect, useState } from "react";
import { authApi } from "../../axios";
import {
    CenterScreen,
    Logo,
    LoginCard,
    LoginTitle,
    LoginSub,
    FieldLabel,
    Input,
    SubmitBtn,
    ErrorText,
    StatusText,
} from "./style";

// SDK index.html'da statik <script> sifatida, bizning modulimizdan OLDIN
// yuklanadi — shuning uchun bu deyarli har doim darhol tayyor bo'ladi.
// Juda sekin tarmoqlar uchun bir necha marta qayta tekshiramiz, xolos.
const waitForTelegramWebApp = (retries = 20, delayMs = 100) =>
    new Promise((resolve) => {
        const check = (n) => {
            if (window.Telegram?.WebApp) {
                resolve(window.Telegram.WebApp);
                return;
            }
            if (n <= 0) {
                resolve(null);
                return;
            }
            setTimeout(() => check(n - 1), delayMs);
        };
        check(retries);
    });

/**
 * Bu sahifa endi mustaqil interfeys emas — shunchaki "kirish ko'prigi":
 * Telegram orqali (initData bilan) avtomatik autentifikatsiya qiladi,
 * so'ng foydalanuvchini to'g'ridan-to'g'ri haqiqiy Dashboard'ga yo'naltiradi.
 * Shunda Missions, Routine, Statistics — BUTUN sayt, xuddi brauzerdagidek,
 * Telegram ichida ham ishlaydi (Sidebar allaqachon mobilga moslashgan).
 */
const TelegramApp = () => {
    const [phase, setPhase] = useState("loading"); // loading | login | error
    const [initData, setInitData] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const [email, setEmail] = useState("");
    const [parol, setParol] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const boot = async () => {
            try {
                const tg = await waitForTelegramWebApp();
                if (cancelled) return;

                if (!tg || !tg.initData) {
                    setErrorMsg("Bu sahifa faqat Telegram ilovasi ichida ishlaydi.");
                    setPhase("error");
                    return;
                }

                tg.ready();
                tg.expand();
                try {
                    tg.setHeaderColor?.("#0E141F");
                    tg.setBackgroundColor?.("#0E141F");
                    tg.disableVerticalSwipes?.();
                } catch {
                    // Eski Telegram versiyalarida bu metodlar bo'lmasligi mumkin — muhim emas
                }

                const data = tg.initData;
                setInitData(data);

                const { data: res } = await authApi.post("/telegram/mini-app-auth", { initData: data });
                if (cancelled) return;

                if (res.linked) {
                    localStorage.setItem("token", res.token);
                    // navigate() emas — to'liq sahifa yangilanishi kerak, shunda
                    // UserProvider yangi token bilan /auth/me'ni to'g'ri chaqiradi
                    // (uning o'zi faqat ilova birinchi ochilganda ishlaydi).
                    window.location.href = "/dashboard";
                } else {
                    setPhase("login");
                }
            } catch {
                if (!cancelled) {
                    setErrorMsg("Ulanishda xatolik yuz berdi. Qayta urinib ko'ring.");
                    setPhase("error");
                }
            }
        };

        boot();
        return () => {
            cancelled = true;
        };
    }, []);

    // Birinchi marta ochilganda: oddiy email/parol bilan kirib, shu Telegram
    // hisobini ushbu foydalanuvchiga bog'laydi, so'ng Dashboard'ga o'tadi
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError(null);
        try {
            const { data } = await authApi.post("/auth/login", { email, parol });
            localStorage.setItem("token", data.token);
            await authApi.post("/telegram/link-via-miniapp", { initData });
            window.location.href = "/dashboard";
        } catch (err) {
            setLoginError(err.response?.data?.message || "Email yoki parol noto'g'ri");
        } finally {
            setLoginLoading(false);
        }
    };

    if (phase === "loading") {
        return (
            <CenterScreen>
                <Logo>TartibOS</Logo>
                <StatusText>Yuklanmoqda...</StatusText>
            </CenterScreen>
        );
    }

    if (phase === "error") {
        return (
            <CenterScreen>
                <Logo>TartibOS</Logo>
                <StatusText>{errorMsg}</StatusText>
            </CenterScreen>
        );
    }

    // phase === "login"
    return (
        <CenterScreen>
            <LoginCard>
                <Logo style={{ textAlign: "center", marginBottom: 8 }}>TartibOS</Logo>
                <LoginTitle>Hisobingizni bog'lang</LoginTitle>
                <LoginSub>Bir marta kiring — Telegram orqali ham to'liq TartibOS'dan foydalaning</LoginSub>
                <form onSubmit={handleLogin}>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                    <FieldLabel>Parol</FieldLabel>
                    <Input
                        type="password"
                        value={parol}
                        onChange={(e) => setParol(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                    {loginError && <ErrorText>{loginError}</ErrorText>}
                    <SubmitBtn type="submit" $disabled={loginLoading} disabled={loginLoading}>
                        {loginLoading ? "Kirilmoqda..." : "Kirish va bog'lash"}
                    </SubmitBtn>
                </form>
            </LoginCard>
        </CenterScreen>
    );
};

export default TelegramApp;
