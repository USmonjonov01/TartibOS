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
    amber: tokens.colors.amber,
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
    max-width: 960px;
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

export const FilterRow = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    flex-wrap: wrap;
`;

export const FilterChip = styled.button`
    padding: 7px 16px;
    border-radius: 20px;
    border: 1px solid ${(p) => (p.$active ? colors.primary : colors.border)};
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
    background: ${(p) => (p.$active ? colors.primaryLight : "transparent")};
    color: ${(p) => (p.$active ? colors.primary : colors.textMuted)};
    white-space: nowrap;
`;

export const SummaryGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 24px;

    @media (max-width: 560px) {
        grid-template-columns: 1fr;
    }
`;

export const SummaryCard = styled.div`
    background: ${tokens.colors.surface};
    border: 1px solid ${colors.border};
    border-radius: ${tokens.radius.lg};
    box-shadow: ${cardShadow};
    padding: 18px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const SummaryLabel = styled.span`
    font-size: 13px;
    color: ${colors.textMuted};
`;

export const SummaryValue = styled.span`
    font-size: 22px;
    font-weight: 700;
    color: ${colors.text};
    font-family: ${tokens.font.mono};
`;

export const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const RoutineRow = styled.div`
    background: ${tokens.colors.surface};
    border: 1px solid ${colors.border};
    border-radius: 16px;
    box-shadow: ${cardShadow};
    padding: 18px 20px;
    min-height: 56px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: background 0.15s, border-color 0.15s;
    opacity: ${(p) => (p.$pending ? 0.6 : 1)};

    &:hover {
        background: ${tokens.colors.surfaceHover};
        border-color: ${tokens.colors.steelPast};
    }

    @media (max-width: 640px) {
        flex-wrap: wrap;
    }
`;

export const RoutineIcon = styled.div`
    font-size: 24px;
    flex-shrink: 0;
`;

export const RoutineBody = styled.div`
    flex: 1;
    min-width: 0;
`;

export const RoutineTitleRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    flex-wrap: wrap;
`;

export const RoutineName = styled.span`
    font-size: 15px;
    font-weight: 600;
    color: ${colors.text};
    overflow-wrap: anywhere;
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

export const RoutineMetaRow = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
`;

export const TimeTag = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: ${tokens.font.mono};
    font-size: 12px;
    color: ${colors.textMuted};
    white-space: nowrap;

    span {
        color: ${colors.textSubtle};
    }
`;

export const DaysRow = styled.div`
    display: flex;
    gap: 4px;
`;

export const DayChip = styled.span`
    font-size: 10px;
    font-weight: 600;
    padding: 3px 6px;
    border-radius: 6px;
    background: ${(p) => (p.$active ? colors.primaryLight : colors.borderSubtle)};
    color: ${(p) => (p.$active ? colors.primary : colors.textSubtle)};
`;

export const VersionTag = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: ${tokens.font.mono};
    font-size: 11px;
    color: ${colors.textSubtle};
    white-space: nowrap;
`;

export const RoutineActions = styled.div`
    display: flex;
    gap: 6px;
    flex-shrink: 0;
`;

export const IconButton = styled.button`
    width: 34px;
    height: 34px;
    border-radius: 9px;
    border: 1px solid ${colors.border};
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.12s;
    color: ${(p) => (p.$danger ? colors.danger : colors.textMuted)};

    &:hover {
        background: ${(p) => (p.$danger ? colors.dangerLight : colors.hover)};
        border-color: ${(p) => (p.$danger ? colors.danger : tokens.colors.steelPast)};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
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
    font-size: 36px;
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
    max-width: 520px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
    max-height: 90vh;
    overflow-y: auto;
`;

export const ModalHeader = styled.div`
    padding: 24px 32px;
    border-bottom: 1px solid ${colors.borderSubtle};
    display: flex;
    justify-content: space-between;
    align-items: center;
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

export const ModalPad = styled.div`
    padding: 24px 32px 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
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

export const FieldError = styled.div`
    font-size: 12px;
    color: ${colors.danger};
`;

export const DaysPickerRow = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 4px;
`;

export const DayToggle = styled.button`
    width: 38px;
    height: 38px;
    border-radius: 10px;
    border: 1px solid ${(p) => (p.$active ? colors.primary : colors.border)};
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.12s;
    background: ${(p) => (p.$active ? colors.primary : "transparent")};
    color: ${(p) => (p.$active ? tokens.colors.bg : colors.textMuted)};
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
