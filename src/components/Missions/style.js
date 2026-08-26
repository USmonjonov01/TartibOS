import styled from "styled-components";
import { tokens } from "../../theme/tokens";

export const colors = {
    border: tokens.colors.hairline,
    borderSubtle: tokens.colors.hairlineSoft,
    primary: tokens.colors.amber,
    primaryHover: tokens.colors.amberStrong,
    primaryLight: tokens.colors.amberSoft,
    accent: tokens.colors.steelPast,
    accentLight: tokens.colors.steelPastSoft,
    success: tokens.colors.success,
    successLight: tokens.colors.successSoft,
    warning: tokens.colors.amber,
    warningLight: tokens.colors.amberSoft,
    danger: tokens.colors.danger,
    dangerLight: tokens.colors.dangerSoft,
    text: tokens.colors.textPrimary,
    textMuted: tokens.colors.textSecondary,
    textSubtle: tokens.colors.textMuted,
    hover: tokens.colors.surfaceRaised,
};

const cardShadow = "0 1px 2px rgba(0, 0, 0, 0.3)";

export const Wrapper = styled.div`
    padding: 40px 40px;
    max-width: 900px;
    margin: 0 auto;
    font-family: ${tokens.font.body};

    @media (max-width: 768px) {
        padding: 16px;
    }
`;

export const HeaderRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 32px;
    gap: 16px;
    flex-wrap: wrap;
`;

export const Title = styled.h1`
    font-family: ${tokens.font.display};
    font-size: 28px;
    font-weight: 600;
    color: ${colors.text};
    margin: 0;
    letter-spacing: -0.02em;
`;

export const Subtitle = styled.p`
    margin: 4px 0 0;
    color: ${colors.textSubtle};
    font-size: 14px;
`;

export const AddButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: ${colors.primary};
    color: ${tokens.colors.bg};
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;
    font-family: inherit;

    &:hover {
        background: ${colors.primaryHover};
    }
`;

export const TabsRow = styled.div`
    display: flex;
    gap: 4px;
    margin-bottom: 24px;
    background: ${tokens.colors.surface};
    border: 1px solid ${colors.borderSubtle};
    padding: 4px;
    border-radius: 14px;
    width: fit-content;
    max-width: 100%;
    overflow-x: auto;
`;

export const TabButton = styled.button`
    position: relative;
    padding: 9px 18px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    transition: background 0.15s, color 0.15s;
    white-space: nowrap;
    background: ${(p) => (p.$active ? tokens.colors.surfaceRaised : "transparent")};
    color: ${(p) => (p.$active ? colors.primary : colors.textMuted)};

    &:hover {
        color: ${(p) => (p.$active ? colors.primary : colors.text)};
    }
`;

export const TabCount = styled.span`
    margin-left: 6px;
    font-family: ${tokens.font.mono};
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 10px;
    background: ${(p) => (p.$active ? colors.primaryLight : colors.borderSubtle)};
    color: ${(p) => (p.$active ? colors.primary : colors.textSubtle)};
`;

export const ProgressCard = styled.div`
    background: ${tokens.colors.surface};
    border: 1px solid ${colors.border};
    border-radius: ${tokens.radius.lg};
    box-shadow: ${cardShadow};
    padding: 20px 24px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
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
    background: linear-gradient(90deg, ${colors.primary}, ${colors.accent});
    width: ${(p) => p.$pct}%;
    transition: width 0.4s ease;
`;

export const ProgressLabel = styled.span`
    font-family: ${tokens.font.mono};
    font-size: 13px;
    font-weight: 600;
    color: ${colors.textMuted};
    white-space: nowrap;
`;

export const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const MissionRow = styled.div`
    background: ${tokens.colors.surface};
    border: 1px solid ${colors.border};
    border-radius: 16px;
    box-shadow: ${cardShadow};
    padding: 16px 20px;
    min-height: 56px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 14px;
    opacity: ${(p) => (p.$done ? 0.6 : 1)};
    transition: opacity 0.2s, background 0.15s;

    &:hover {
        background: ${(p) => (p.$done ? tokens.colors.surface : tokens.colors.surfaceHover)};
    }
`;

export const CheckButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
    display: flex;
`;

export const MissionBody = styled.div`
    flex: 1;
    min-width: 0;
`;

export const MissionTitle = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: ${(p) => (p.$done ? colors.textSubtle : colors.text)};
    text-decoration: ${(p) => (p.$done ? "line-through" : "none")};
    margin-bottom: ${(p) => (p.$hasNote ? "2px" : 0)};
    overflow-wrap: anywhere;
`;

export const MissionNote = styled.div`
    font-size: 12px;
    color: ${colors.textSubtle};
`;

export const MissionMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
    flex-wrap: wrap;
`;

export const PriorityBadge = styled.span`
    font-size: 11px;
    font-weight: 600;
    color: ${(p) => p.$color};
    background: ${(p) => p.$bg};
    padding: 3px 9px;
    border-radius: 10px;
    white-space: nowrap;
`;

export const MetaTag = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: ${tokens.font.mono};
    font-size: 11.5px;
    color: ${colors.textSubtle};
    white-space: nowrap;
`;

export const RemoveButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    display: flex;
    flex-shrink: 0;
    opacity: 0.4;
    transition: opacity 0.15s, background 0.15s;

    &:hover {
        opacity: 1;
        background: ${colors.dangerLight};
    }
`;

export const CancelButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    display: flex;
    flex-shrink: 0;
    opacity: 0.4;
    transition: opacity 0.15s, background 0.15s;

    &:hover {
        opacity: 1;
        background: ${colors.warningLight};
    }
`;

export const RowActions = styled.div`
    display: flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
`;

export const EmptyState = styled.div`
    text-align: center;
    padding: 64px 24px;
    background: ${tokens.colors.surface};
    border-radius: ${tokens.radius.lg};
    border: 1px solid ${colors.border};
    box-shadow: ${cardShadow};
`;

export const EmptyIcon = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
    opacity: 0.7;
`;

export const EmptyTitle = styled.div`
    font-size: 15px;
    font-weight: 600;
    color: ${colors.text};
    margin-bottom: 8px;
`;

export const EmptySub = styled.div`
    font-size: 13px;
    color: ${colors.textSubtle};
    margin-bottom: 24px;
`;

export const StatusText = styled.div`
    padding: 40px 0;
    text-align: center;
    color: ${colors.textSubtle};
    font-family: ${tokens.font.mono};
    font-size: 14px;
`;

export const ErrorBanner = styled.div`
    background: ${colors.dangerLight};
    color: #F0A99E;
    border: 1px solid rgba(200, 92, 78, 0.35);
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 13px;
    margin-bottom: 24px;
`;

/* Modal */

export const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(4, 7, 12, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(3px);
    padding: 16px;
`;

export const ModalBox = styled.div`
    background: ${tokens.colors.surface};
    border: 1px solid ${colors.border};
    border-radius: ${tokens.radius.lg};
    width: 100%;
    max-width: 480px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
    max-height: 90vh;
    overflow-y: auto;
`;

export const ModalPad = styled.div`
    padding: 32px 32px 24px;
`;

export const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
`;

export const ModalTitle = styled.h3`
    margin: 0;
    font-family: ${tokens.font.display};
    font-size: 18px;
    font-weight: 600;
    color: ${colors.text};
`;

export const CloseButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 8px;
    display: flex;
`;

export const FormStack = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const FieldGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
`;

export const Field = styled.div``;

export const FieldLabel = styled.label`
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: ${colors.textMuted};
    margin-bottom: 8px;
`;

const fieldBase = `
    width: 100%;
    padding: 10px 12px;
    border-radius: 10px;
    font-size: 14px;
    color: ${colors.text};
    font-family: inherit;
    outline: none;
    background: ${tokens.colors.surfaceRaised};
    box-sizing: border-box;
    transition: border-color 0.15s;
`;

export const Input = styled.input`
    ${fieldBase}
    border: 1px solid ${colors.border};

    &:focus {
        border-color: ${colors.primary};
    }
`;

export const Select = styled.select`
    ${fieldBase}
    border: 1px solid ${colors.border};
    cursor: pointer;

    &:focus {
        border-color: ${colors.primary};
    }
`;

export const Textarea = styled.textarea`
    ${fieldBase}
    border: 1px solid ${colors.border};
    resize: vertical;
    min-height: 64px;

    &:focus {
        border-color: ${colors.primary};
    }
`;

export const FieldError = styled.div`
    font-size: 12px;
    color: ${colors.danger};
    margin-top: 4px;
`;

export const ModalActions = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 4px;
`;

export const PrimaryButton = styled.button`
    flex: ${(p) => (p.$flex ? 1 : "initial")};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 20px;
    background: ${colors.primary};
    color: ${tokens.colors.bg};
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s;
    opacity: ${(p) => (p.$disabled ? 0.6 : 1)};

    &:hover {
        background: ${(p) => (p.$disabled ? colors.primary : colors.primaryHover)};
    }
`;

export const SecondaryButton = styled.button`
    padding: 10px 20px;
    background: ${colors.hover};
    color: ${colors.text};
    border: 1px solid ${colors.border};
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
`;
