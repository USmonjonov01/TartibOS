import styled, { keyframes } from "styled-components";
import { tokens } from "../../theme/tokens";

const { colors } = tokens;

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
`;

const slide = keyframes`
    0% { transform: translateX(-100%); }
    100% { transform: translateX(260%); }
`;

const spin = keyframes`
    to { transform: rotate(360deg); }
`;

export const Shell = styled.div`
    width: 100%;
    animation: ${fadeIn} 0.25s ease;
`;

/* --- Yuqoridagi 3 bosqichli indikator: Maqsad → Yo'l xaritasi → Kun tartibi --- */

export const Stepper = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 22px;
    flex-wrap: wrap;
`;

export const StepperItem = styled.div`
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    font-weight: 600;
    color: ${(p) => (p.$active ? colors.textPrimary : colors.textMuted)};
`;

export const StepperDot = styled.span`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-family: ${tokens.font.mono};
    background: ${(p) => (p.$done ? colors.success : p.$active ? colors.amber : "transparent")};
    color: ${(p) => (p.$done || p.$active ? colors.onAccent : colors.textMuted)};
    border: 1.5px solid ${(p) => (p.$done ? colors.success : p.$active ? colors.amber : colors.hairline)};
`;

export const StepperLine = styled.span`
    width: 18px;
    height: 1.5px;
    background: ${colors.hairline};
`;

/* --- Matnlar --- */

export const Heading = styled.h2`
    margin: 0 0 8px;
    font-family: ${tokens.font.display};
    font-size: 24px;
    line-height: 1.25;
    font-weight: 700;
    color: ${colors.textPrimary};
`;

export const Lead = styled.p`
    margin: 0 0 20px;
    font-size: 14px;
    line-height: 1.6;
    color: ${colors.textSecondary};
`;

export const Label = styled.div`
    font-size: 12px;
    font-weight: 600;
    color: ${colors.textMuted};
    margin: 18px 0 8px;
`;

export const GoalInput = styled.input`
    width: 100%;
    box-sizing: border-box;
    padding: 14px 16px;
    font-size: 16px;
    border-radius: ${tokens.radius.md};
    border: 1.5px solid ${colors.hairline};
    background: ${colors.surface};
    color: ${colors.textPrimary};

    &:focus {
        outline: none;
        border-color: ${colors.amber};
    }
`;

export const ChipRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
`;

export const Chip = styled.button`
    padding: 7px 12px;
    border-radius: 999px;
    font-size: 12.5px;
    cursor: pointer;
    border: 1px solid ${(p) => (p.$active ? colors.amber : colors.hairline)};
    background: ${(p) => (p.$active ? colors.amberSoft : "transparent")};
    color: ${(p) => (p.$active ? colors.amberStrong : colors.textSecondary)};
    font-weight: ${(p) => (p.$active ? 600 : 500)};

    &:hover {
        border-color: ${colors.amber};
    }
`;

/* --- Tugmalar --- */

export const Actions = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 24px;
    flex-wrap: wrap;
`;

export const PrimaryButton = styled.button`
    flex: 1;
    min-width: 180px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 13px 18px;
    border-radius: ${tokens.radius.md};
    border: none;
    background: ${colors.amber};
    color: ${colors.onAccent};
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;

    &:hover:not(:disabled) {
        background: ${colors.amberStrong};
    }

    &:disabled {
        opacity: 0.5;
        cursor: default;
    }
`;

export const SecondaryButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 13px 18px;
    border-radius: ${tokens.radius.md};
    border: 1px solid ${colors.hairline};
    background: transparent;
    color: ${colors.textPrimary};
    font-size: 14px;
    cursor: pointer;

    &:hover:not(:disabled) {
        border-color: ${colors.amber};
    }

    &:disabled {
        opacity: 0.5;
        cursor: default;
    }
`;

export const GhostLink = styled.button`
    display: block;
    margin: 16px auto 0;
    padding: 4px 8px;
    border: none;
    background: none;
    font-size: 13px;
    color: ${colors.textMuted};
    cursor: pointer;

    &:hover {
        color: ${colors.textSecondary};
        text-decoration: underline;
    }
`;

export const ErrorNote = styled.div`
    margin-top: 14px;
    padding: 10px 12px;
    border-radius: ${tokens.radius.md};
    background: ${colors.dangerSoft};
    color: ${colors.danger};
    font-size: 13px;
    line-height: 1.5;
`;

/* --- AI ishlayotgan holat --- */

export const ThinkingCard = styled.div`
    padding: 28px 22px;
    border-radius: ${tokens.radius.lg};
    border: 1px solid ${colors.hairline};
    background: ${colors.surfaceRaised};
    text-align: center;
`;

export const ThinkingIcon = styled.div`
    display: inline-flex;
    color: ${colors.amber};
    margin-bottom: 12px;

    svg {
        animation: ${spin} 2.4s linear infinite;
    }
`;

export const ThinkingText = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: ${colors.textPrimary};
    min-height: 20px;
`;

export const ThinkingHint = styled.div`
    margin-top: 4px;
    font-size: 12.5px;
    color: ${colors.textMuted};
`;

export const ThinkingBar = styled.div`
    position: relative;
    height: 4px;
    margin-top: 18px;
    border-radius: 999px;
    background: ${colors.hairline};
    overflow: hidden;

    &::after {
        content: "";
        position: absolute;
        inset: 0 auto 0 0;
        width: 40%;
        border-radius: 999px;
        background: ${colors.amber};
        animation: ${slide} 1.4s ease-in-out infinite;
    }
`;

/* --- Yo'l xaritasi preview --- */

export const CountBadge = styled.span`
    display: inline-block;
    margin-left: 8px;
    padding: 2px 9px;
    border-radius: 999px;
    background: ${colors.amberSoft};
    color: ${colors.amberStrong};
    font-family: ${tokens.font.mono};
    font-size: 12px;
    font-weight: 600;
    vertical-align: middle;
`;

export const StepsList = styled.ol`
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 340px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-right: 4px;
`;

export const StepItem = styled.li`
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 9px 10px;
    border-radius: ${tokens.radius.md};
    background: ${colors.surfaceRaised};
`;

export const StepNumber = styled.span`
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: ${tokens.font.mono};
    font-size: 11px;
    color: ${colors.amberStrong};
    background: ${colors.amberSoft};
`;

export const StepBody = styled.div`
    flex: 1;
    min-width: 0;
    font-size: 13.5px;
    line-height: 1.45;
    color: ${colors.textPrimary};
`;

export const StepStage = styled.div`
    margin-top: 2px;
    font-size: 11px;
    font-family: ${tokens.font.mono};
    color: ${colors.textMuted};
`;

export const RemoveButton = styled.button`
    flex-shrink: 0;
    border: none;
    background: none;
    color: ${colors.textMuted};
    cursor: pointer;
    padding: 2px;
    display: flex;

    &:hover {
        color: ${colors.danger};
    }
`;

/* --- Kun tartibi so'rovi va natijasi --- */

export const Celebrate = styled.div`
    width: 52px;
    height: 52px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
    background: ${colors.successSoft};
    color: ${colors.success};
`;

export const RoutineList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 340px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const RoutineItem = styled.li`
    display: flex;
    gap: 12px;
    padding: 11px 12px;
    border-radius: ${tokens.radius.md};
    border: 1px solid ${colors.hairlineSoft};
    background: ${colors.surface};
`;

export const RoutineEmoji = styled.span`
    font-size: 20px;
    line-height: 1.2;
`;

export const RoutineMain = styled.div`
    flex: 1;
    min-width: 0;
`;

export const RoutineTitle = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: ${colors.textPrimary};
`;

export const RoutineMeta = styled.div`
    margin-top: 3px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: ${colors.textSecondary};
`;

export const TimeTag = styled.span`
    font-family: ${tokens.font.mono};
    color: ${colors.amberStrong};
`;

export const DayTag = styled.span`
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 11px;
    background: ${colors.surfaceRaised};
    color: ${colors.textSecondary};
`;

export const Note = styled.div`
    margin-top: 14px;
    font-size: 12.5px;
    line-height: 1.55;
    color: ${colors.textMuted};
`;

/* Roadmap sahifasidagi modal uchun kengroq quti (asl ModalBox 440px — bu yerga tor) */
export const WideModalBox = styled.div`
    background: ${colors.surface};
    border: 1px solid ${colors.hairline};
    border-radius: ${tokens.radius.lg};
    width: 100%;
    max-width: 620px;
    max-height: calc(100vh - 32px);
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    padding: 28px 28px 24px;
    box-sizing: border-box;
`;
