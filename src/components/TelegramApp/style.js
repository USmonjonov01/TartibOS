import styled from "styled-components";
import { tokens } from "../../theme/tokens";

export const colors = {
    border: tokens.colors.hairline,
    borderSubtle: tokens.colors.hairlineSoft,
    primary: tokens.colors.amber,
    primaryHover: tokens.colors.amberStrong,
    primaryLight: tokens.colors.amberSoft,
    success: tokens.colors.success,
    successLight: tokens.colors.successSoft,
    danger: tokens.colors.danger,
    dangerLight: tokens.colors.dangerSoft,
    warning: tokens.colors.amber,
    text: tokens.colors.textPrimary,
    textMuted: tokens.colors.textSecondary,
    textSubtle: tokens.colors.textMuted,
};

const cardShadow = "0 1px 2px rgba(0, 0, 0, 0.3)";

export const Screen = styled.div`
    min-height: 100vh;
    background: ${tokens.colors.bg};
    color: ${colors.text};
    font-family: ${tokens.font.body};
    padding: 20px 16px 40px;
    box-sizing: border-box;
`;

export const CenterScreen = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 24px;
    text-align: center;
`;

export const Logo = styled.div`
    font-family: ${tokens.font.display};
    font-size: 22px;
    font-weight: 700;
    color: ${colors.primary};
`;

export const Header = styled.div`
    margin-bottom: 20px;
`;

export const Greeting = styled.h1`
    font-family: ${tokens.font.display};
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 4px;
`;

export const DateLine = styled.div`
    font-family: ${tokens.font.mono};
    font-size: 12px;
    color: ${colors.textSubtle};
`;

export const ProgressCard = styled.div`
    background: ${tokens.colors.surface};
    border-radius: 16px;
    box-shadow: ${cardShadow};
    padding: 16px 18px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 14px;
`;

export const ProgressTrack = styled.div`
    flex: 1;
    height: 6px;
    background: ${colors.borderSubtle};
    border-radius: 3px;
    overflow: hidden;
`;

export const ProgressFill = styled.div`
    height: 100%;
    border-radius: 3px;
    background: ${colors.primary};
    width: ${(p) => p.$pct}%;
    transition: width 0.4s ease;
`;

export const ProgressLabel = styled.span`
    font-family: ${tokens.font.mono};
    font-size: 13px;
    font-weight: 700;
    color: ${colors.text};
    white-space: nowrap;
`;

export const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const HabitCard = styled.div`
    background: ${tokens.colors.surface};
    border-radius: 16px;
    box-shadow: ${cardShadow};
    padding: 14px 16px;
    opacity: ${(p) => (p.$done ? 0.6 : 1)};
`;

export const HabitTop = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const HabitEmoji = styled.div`
    font-size: 20px;
    flex-shrink: 0;
`;

export const HabitBody = styled.div`
    flex: 1;
    min-width: 0;
`;

export const HabitTitle = styled.div`
    font-size: 14.5px;
    font-weight: 600;
    text-decoration: ${(p) => (p.$done ? "line-through" : "none")};
    color: ${(p) => (p.$done ? colors.textSubtle : colors.text)};
`;

export const HabitPlan = styled.div`
    font-size: 12px;
    color: ${colors.primary};
    font-weight: 600;
    margin-top: 2px;
`;

export const HabitTime = styled.div`
    font-family: ${tokens.font.mono};
    font-size: 11.5px;
    color: ${colors.textSubtle};
    white-space: nowrap;
`;

export const ActionRow = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 12px;
`;

export const ActionBtn = styled.button`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 9px 0;
    border-radius: 10px;
    border: 1px solid ${(p) => (p.$active ? "transparent" : colors.border)};
    background: ${(p) => (p.$active ? p.$activeColor : "transparent")};
    color: ${(p) => (p.$active ? tokens.colors.bg : colors.textMuted)};
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s;
`;

export const StarsRow = styled.div`
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid ${colors.borderSubtle};
`;

export const StarBtn = styled.button`
    background: none;
    border: none;
    padding: 2px;
    cursor: pointer;
    display: flex;
    line-height: 0;
`;

export const ReasonInput = styled.textarea`
    width: 100%;
    margin-top: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid ${colors.border};
    background: ${tokens.colors.surfaceRaised};
    color: ${colors.text};
    font-family: inherit;
    font-size: 13px;
    resize: vertical;
    min-height: 50px;
    box-sizing: border-box;
    outline: none;

    &:focus {
        border-color: ${colors.primary};
    }
`;

export const SaveReasonBtn = styled.button`
    margin-top: 8px;
    width: 100%;
    padding: 9px 0;
    border-radius: 10px;
    border: none;
    background: ${colors.primary};
    color: ${tokens.colors.bg};
    font-size: 13px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
`;

export const EmptyState = styled.div`
    text-align: center;
    padding: 60px 20px;
    color: ${colors.textSubtle};
`;

export const StatusText = styled.div`
    text-align: center;
    padding: 40px 0;
    color: ${colors.textSubtle};
    font-family: ${tokens.font.mono};
    font-size: 13px;
`;

/* ---------- Bog'lash formasi (birinchi marta ochilganda) ---------- */

export const LoginCard = styled.div`
    width: 100%;
    max-width: 320px;
    background: ${tokens.colors.surface};
    border-radius: 16px;
    box-shadow: ${cardShadow};
    padding: 24px 20px;
    text-align: left;
`;

export const LoginTitle = styled.h2`
    font-family: ${tokens.font.display};
    font-size: 17px;
    font-weight: 700;
    margin: 0 0 6px;
    text-align: center;
`;

export const LoginSub = styled.p`
    font-size: 13px;
    color: ${colors.textSubtle};
    text-align: center;
    margin: 0 0 20px;
`;

export const FieldLabel = styled.label`
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: ${colors.textMuted};
    margin-bottom: 6px;
`;

export const Input = styled.input`
    width: 100%;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid ${colors.border};
    background: ${tokens.colors.surfaceRaised};
    color: ${colors.text};
    font-family: inherit;
    font-size: 14px;
    box-sizing: border-box;
    outline: none;
    margin-bottom: 14px;

    &:focus {
        border-color: ${colors.primary};
    }
`;

export const SubmitBtn = styled.button`
    width: 100%;
    padding: 11px 0;
    border-radius: 10px;
    border: none;
    background: ${colors.primary};
    color: ${tokens.colors.bg};
    font-size: 14px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    opacity: ${(p) => (p.$disabled ? 0.6 : 1)};
`;

export const ErrorText = styled.div`
    font-size: 12.5px;
    color: ${colors.danger};
    margin: -6px 0 12px;
`;

export const ChangeLink = styled.button`
    background: none;
    border: none;
    padding: 0;
    margin-top: 8px;
    font-size: 11.5px;
    color: ${colors.textSubtle};
    text-decoration: underline;
    cursor: pointer;
    font-family: inherit;
`;

export const StatusBadge = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    background: ${(p) => p.$bg};
    color: ${(p) => p.$color};
`;

export const NoteText = styled.div`
    font-size: 12px;
    color: ${colors.textSubtle};
    margin-top: 6px;
    font-style: italic;
`;
