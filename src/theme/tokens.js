// TartibOS V2 vizual identifikatsiyasi.
//
// Eski konsepsiya ("Balandlik jurnali" — tungi alp-kechasi, amber signal rang)
// TartibOS'ni texnik monitoring paneliga o'xshatib qo'ygan edi. Yangi yo'nalish:
// TartibOS — shaxsiy, sokin va aqlli bir makon, foydalanuvchi o'zining shaxsiy
// tizimiga kirgandek his qilishi kerak. Bu yerda tizim hukmronlik qilmaydi —
// u faqat yordam beradi ("present, not dominant").
//
// Ikkala rejim ham (light — asosiy, dark — yumshoq grafit) foydalanuvchi
// o'zi tanlaydi (ThemeContext, pastda). Buni CSS custom property'lar orqali
// amalga oshiramiz: `tokens.colors.*` endi to'g'ridan-to'g'ri hex emas,
// balki `var(--token-nomi)` satrlarini qaytaradi. Bu shuni anglatadiki,
// har bir style.js fayl o'zgarishsiz qoladi (ular baribir shu obyektdan
// o'qiydi) — faqat brauzer <html data-theme="dark"> atributiga qarab CSS
// o'zgaruvchisining qiymatini avtomatik almashtiradi (index.css'dagi
// :root va [data-theme='dark'] bloklariga qarang). Reaktivlik uchun
// React qayta render qilinishi shart emas.
//
// `palettes.light` / `palettes.dark` — xom (hex) qiymatlar. Bular faqat
// CSS o'zgaruvchilarini to'ldirish uchun (index.css) va antd ConfigProvider
// kabi CSS-var tushunmaydigan JS-darajasidagi rang hisob-kitoblari uchun
// ishlatiladi (theme/antdTheme.js'ga qarang).

const light = {
    bg: "#F7F7F4",
    surface: "#FFFFFF",
    surfaceRaised: "#EFEFEA",
    hairline: "#E3E4DE",
    hairlineSoft: "#ECECE7",

    textPrimary: "#1F2220",
    textSecondary: "#6B6F67",
    textMuted: "#9A9D95",

    // Signal — sokin indigo/binafsha ("intelligence, direction, calm")
    amber: "#5A54C4",
    amberSoft: "rgba(90, 84, 196, 0.10)",
    amberStrong: "#4A459F",

    // Ikkinchi darajali sovuq-neytral urg'u (solishtirish chiziqlari va h.k.)
    steelPast: "#5F6B82",
    steelPastSoft: "rgba(95, 107, 130, 0.10)",

    success: "#3E8F63",
    successSoft: "rgba(62, 143, 99, 0.10)",

    danger: "#B8493C",
    dangerSoft: "rgba(184, 73, 60, 0.10)",

    // Signal/accent fon ustidagi matn (masalan, to'ldirilgan tugmalar)
    onAccent: "#FFFFFF",
};

// Dark rejim ONLINE emas — logotip va favicon aslida shu asl "orange + dark
// navy" vibega mos qilib yasalgan, shuning uchun dark rejim ataylab ESKI
// palitrani saqlaydi (indigo faqat light rejimda). Light va dark shu tariqa
// ataylab boshqa-boshqa "shaxsiyat" bilan qoladi — ikkalasi ham o'zicha izchil.
const dark = {
    bg: "#0E141F",
    surface: "#161F30",
    surfaceRaised: "#1D2A40",
    hairline: "#2A3A54",
    hairlineSoft: "#212D42",

    textPrimary: "#EEF2F8",
    textSecondary: "#9FADC4",
    textMuted: "#66748F",

    amber: "#E7A94C",
    amberSoft: "rgba(231, 169, 76, 0.14)",
    amberStrong: "#F4C575",

    steelPast: "#6B7B99",
    steelPastSoft: "rgba(107, 123, 153, 0.16)",

    success: "#3AA872",
    successSoft: "rgba(58, 168, 114, 0.14)",

    danger: "#C85C4E",
    dangerSoft: "rgba(200, 92, 78, 0.14)",

    onAccent: "#0E141F",
};

// style.js fayllar ishlatadigan asosiy obyekt — qiymatlar CSS o'zgaruvchisiga
// ishora qiladi, shuning uchun theme almashganda avtomatik yangilanadi.
const cssVarColors = {
    bg: "var(--bg)",
    surface: "var(--surface)",
    surfaceRaised: "var(--surface-raised)",
    hairline: "var(--hairline)",
    hairlineSoft: "var(--hairline-soft)",
    textPrimary: "var(--text-primary)",
    textSecondary: "var(--text-secondary)",
    textMuted: "var(--text-muted)",
    amber: "var(--amber)",
    amberSoft: "var(--amber-soft)",
    amberStrong: "var(--amber-strong)",
    steelPast: "var(--steel-past)",
    steelPastSoft: "var(--steel-past-soft)",
    success: "var(--success)",
    successSoft: "var(--success-soft)",
    danger: "var(--danger)",
    dangerSoft: "var(--danger-soft)",
    onAccent: "var(--on-accent)",
};

export const tokens = {
    colors: cssVarColors,
    palettes: { light, dark },

    font: {
        // Sarlavha va matn — bitta oila (Inter), faqat og'irlik bilan farqlanadi.
        display: `"Inter", system-ui, sans-serif`,
        body: `"Inter", system-ui, sans-serif`,
        // Faqat raqamli ma'lumot (foizlar, sanalar, statistikalar) uchun.
        mono: `"JetBrains Mono", ui-monospace, "SFMono-Regular", monospace`,
    },

    radius: { sm: "6px", md: "10px", lg: "18px" },
};

export default tokens;
