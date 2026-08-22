// TartibOS vizual identifikatsiyasi — "Balandlik jurnali" (Ascent Log) konsepsiyasi.
//
// Fikr: TartibOS shunchaki todo-list emas — bu shaxsiy tirmashish (ascent) jurnali.
// Har bir hafta — bir "pog'ona". Foydalanuvchi har safar statistikaga kirganda
// kechagi (yoki o'tgan haftadagi) o'zi bilan yuzlashadi: qancha balandlikka
// ko'tarilgan, qayerda orqaga ketgan. Fon — tungi tog' ekspeditsiyasining
// jurnalxonasi kabi jiddiy va sokin; signal rangi — cho'qqida quyosh chiqishi
// (tong otganda erishilgan yutuq).
//
// Bu fayl — umumiy "vibe" asosi. Hozircha Statistics sahifasida ishlatiladi,
// keyingi bosqichda boshqa sahifalar ham shu tokenlardan foydalanib qayta
// qurilishi mumkin.

export const tokens = {
    colors: {
        // Fon qatlamlari — tungi alp-kechasi (graphite-navy, sof qora emas)
        bg: "#0E141F",
        surface: "#161F30",
        surfaceRaised: "#1D2A40",
        hairline: "#2A3A54",
        hairlineSoft: "#212D42",

        // Matn
        textPrimary: "#EEF2F8",
        textSecondary: "#9FADC4",
        textMuted: "#66748F",

        // Signal — "cho'qqida tong" (bugungi yutuq, o'sish)
        amber: "#E7A94C",
        amberSoft: "rgba(231, 169, 76, 0.14)",
        amberStrong: "#F4C575",

        // "O'tgan" / bazaviy solishtirish chizig'i — sovuq gumush-ko'k
        steelPast: "#6B7B99",
        steelPastSoft: "rgba(107, 123, 153, 0.16)",

        // Maqsadga yetildi
        success: "#3AA872",
        successSoft: "rgba(58, 168, 114, 0.14)",

        // Orqaga ketish / uzilgan streak
        danger: "#C85C4E",
        dangerSoft: "rgba(200, 92, 78, 0.14)",
    },

    font: {
        // Sarlavhalar — texnik-geometrik, "surveyor" hissi (Space Grotesk)
        display: `"Space Grotesk", "Inter", system-ui, sans-serif`,
        // Matn — mavjud Inter bilan izchillik
        body: `"Inter", system-ui, sans-serif`,
        // Raqamlar — asbob paneli aniqligi (JetBrains Mono)
        mono: `"JetBrains Mono", ui-monospace, "SFMono-Regular", monospace`,
    },

    radius: { sm: "6px", md: "10px", lg: "18px" },
};

export default tokens;
