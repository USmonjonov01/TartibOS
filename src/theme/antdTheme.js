import { theme as antdBaseTheme } from "antd";
import { tokens } from "./tokens";

// antd komponentlarini (Card/Progress/Statistic/Table va h.k.) TartibOS'ning
// o'z palitrasiga moslaydi. antd'ning rang algoritmi CSS o'zgaruvchilarini
// (var(--x)) tushunmaydi — u xom hex/rgba qiymatlar bilan ishlaydi — shuning
// uchun bu yerda tokens.palettes'dagi xom qiymatlardan foydalanamiz, `mode`ga
// ("light" | "dark") qarab. ConfigProvider theme ni ThemeContext o'zgarganda
// qayta hisoblab beradi (root/index.jsx'ga qarang).
export const getAntdTheme = (mode = "light") => {
    const p = tokens.palettes[mode] || tokens.palettes.light;

    return {
        algorithm: mode === "dark" ? antdBaseTheme.darkAlgorithm : antdBaseTheme.defaultAlgorithm,
        token: {
            colorPrimary: p.amber,
            colorBgBase: p.bg,
            colorBgContainer: p.surface,
            colorBgElevated: p.surfaceRaised,
            colorBorder: p.hairline,
            colorBorderSecondary: p.hairlineSoft,
            colorText: p.textPrimary,
            colorTextSecondary: p.textSecondary,
            colorTextTertiary: p.textMuted,
            colorSuccess: p.success,
            colorError: p.danger,
            colorWarning: p.amber,
            colorLink: p.amber,
            fontFamily: tokens.font.body,
            borderRadius: 10,
            wireframe: false,
        },
        components: {
            Card: {
                colorBgContainer: p.surface,
                colorBorderSecondary: p.hairline,
            },
            Progress: {
                defaultColor: p.amber,
                remainingColor: p.hairlineSoft,
            },
            Statistic: {
                colorText: p.textPrimary,
                colorTextDescription: p.textSecondary,
            },
            Table: {
                colorBgContainer: p.surface,
                headerBg: p.surfaceRaised,
                borderColor: p.hairline,
                headerColor: p.textSecondary,
            },
            Tag: {
                defaultBg: p.surfaceRaised,
                defaultColor: p.textSecondary,
            },
            Segmented: {
                itemSelectedBg: p.amber,
                itemSelectedColor: p.onAccent,
                trackBg: p.surfaceRaised,
            },
            Empty: {
                colorTextDisabled: p.textMuted,
            },
        },
    };
};

export default getAntdTheme;
