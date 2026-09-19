import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/users";
import { GoogleWrap } from "./style";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Google Identity Services skripti butun ilova bo'ylab BIR marta yuklanadi —
// SignIn va SignUp ikkalasi ham shu komponentni ishlatgani uchun, sahifalar
// orasida o'tishda qayta-qayta yuklanmasligi kerak.
let scriptPromise = null;
const loadGoogleScript = () => {
    if (window.google?.accounts?.id) return Promise.resolve();
    if (scriptPromise) return scriptPromise;

    scriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Google skripti yuklanmadi"));
        document.head.appendChild(script);
    });
    return scriptPromise;
};

// google.accounts.id.initialize() FAQAT BIR MARTA chaqirilishi kerak — aks
// holda Google konsolga "initialize() is called multiple times" ogohlantirishini
// chiqaradi (SignIn va SignUp orasida necha marta o'tsangiz ham komponent
// qayta mount bo'ladi). Shu sabab initialize'ning o'zi global darajada faqat
// bir marta ishga tushadi, uning "callback"i esa doim ENG SO'NGGI mount
// bo'lgan tugmaning funksiyasiga yo'naltiriladi (activeHandler orqali) — shu
// bilan har bir sahifa o'zining navigate/loginWithGoogle'idan foydalanadi.
let initialized = false;
let activeHandler = null;
const ensureInitialized = () => {
    if (initialized || !window.google?.accounts?.id) return;
    window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => activeHandler?.(response),
    });
    initialized = true;
};

// Google'ning tayyor tugmasini (renderButton) ishlatamiz — bu Google
// tomonidan tavsiya etiladigan, eng barqaror usul (o'ziga xos onclick +
// popup boshqaruvini o'zi bajaradi). Faqat GOOGLE_CLIENT_ID sozlangan bo'lsa
// ko'rsatiladi — bo'lmasa komponent shunchaki hech narsa render qilmaydi,
// login/registratsiya oddiy email+parol bilan davom etaveradi.
const GoogleButton = ({ label = "continue_with", onError }) => {
    const wrapRef = useRef(null);
    const navigate = useNavigate();
    const { loginWithGoogle } = useUser();

    // Effekt faqat bir marta ishga tushishi kerak (Google skripti + tugma
    // bitta marta initsializatsiya qilinadi), shu sabab eng so'nggi
    // funksiyalarga ref orqali murojaat qilamiz — stale closure bo'lmaydi.
    // Ref'lar render paytida emas, alohida effektlarda yangilanadi (React 19
    // qoidasi: ref.current'ni render davomida o'zgartirib bo'lmaydi).
    const loginWithGoogleRef = useRef(loginWithGoogle);
    const onErrorRef = useRef(onError);
    const navigateRef = useRef(navigate);

    useEffect(() => {
        loginWithGoogleRef.current = loginWithGoogle;
        onErrorRef.current = onError;
        navigateRef.current = navigate;
    });

    useEffect(() => {
        if (!GOOGLE_CLIENT_ID) return undefined;
        let cancelled = false;

        loadGoogleScript()
            .then(() => {
                if (cancelled || !wrapRef.current || !window.google?.accounts?.id) return;

                // Shu komponent ekranda turgan paytda Google'ning javobi
                // AYNAN shu instansiyaga kelishini ta'minlaydi.
                activeHandler = async (response) => {
                    try {
                        await loginWithGoogleRef.current(response.credential);
                        navigateRef.current("/dashboard");
                    } catch (err) {
                        onErrorRef.current?.(err);
                    }
                };

                ensureInitialized();

                window.google.accounts.id.renderButton(wrapRef.current, {
                    type: "standard",
                    theme: "outline",
                    size: "large",
                    shape: "pill",
                    text: label,
                    logo_alignment: "center",
                    width: 320,
                });
            })
            .catch((err) => onErrorRef.current?.(err));

        return () => {
            cancelled = true;
        };
    }, [label]);

    if (!GOOGLE_CLIENT_ID) return null;

    return <GoogleWrap ref={wrapRef} />;
};

export default GoogleButton;