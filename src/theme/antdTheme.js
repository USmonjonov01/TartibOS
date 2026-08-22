import { theme as antdBaseTheme } from "antd";
import { tokens } from "./tokens";

// antd komponentlarini "Balandlik jurnali" tokenlariga moslashtiradi — antd'ning
// standart ko'k/oq ko'rinishi emas, TartibOS'ning o'z ovozi bilan gapiradi.
export const antdTheme = {
    algorithm: antdBaseTheme.darkAlgorithm,
    token: {
        colorPrimary: tokens.colors.amber,
        colorBgBase: tokens.colors.bg,
        colorBgContainer: tokens.colors.surface,
        colorBgElevated: tokens.colors.surfaceRaised,
        colorBorder: tokens.colors.hairline,
        colorBorderSecondary: tokens.colors.hairlineSoft,
        colorText: tokens.colors.textPrimary,
        colorTextSecondary: tokens.colors.textSecondary,
        colorTextTertiary: tokens.colors.textMuted,
        colorSuccess: tokens.colors.success,
        colorError: tokens.colors.danger,
        colorWarning: tokens.colors.amber,
        colorLink: tokens.colors.amber,
        fontFamily: tokens.font.body,
        borderRadius: 10,
        wireframe: false,
    },
    components: {
        Card: {
            colorBgContainer: tokens.colors.surface,
            colorBorderSecondary: tokens.colors.hairline,
        },
        Progress: {
            defaultColor: tokens.colors.amber,
            remainingColor: tokens.colors.hairlineSoft,
        },
        Statistic: {
            colorText: tokens.colors.textPrimary,
            colorTextDescription: tokens.colors.textSecondary,
        },
        Table: {
            colorBgContainer: tokens.colors.surface,
            headerBg: tokens.colors.surfaceRaised,
            borderColor: tokens.colors.hairline,
            headerColor: tokens.colors.textSecondary,
        },
        Tag: {
            defaultBg: tokens.colors.surfaceRaised,
            defaultColor: tokens.colors.textSecondary,
        },
        Segmented: {
            itemSelectedBg: tokens.colors.amber,
            itemSelectedColor: tokens.colors.bg,
            trackBg: tokens.colors.surfaceRaised,
        },
        Empty: {
            colorTextDisabled: tokens.colors.textMuted,
        },
    },
};

export default antdTheme;
