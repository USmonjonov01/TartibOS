import styled from "styled-components";
import { tokens } from "../../theme/tokens";

export const colors = {
    border: tokens.colors.hairline,
    borderSubtle: tokens.colors.hairlineSoft,
    primary: tokens.colors.amber,
    primaryLight: tokens.colors.amberSoft,
    success: tokens.colors.success,
    successLight: tokens.colors.successSoft,
    text: tokens.colors.textPrimary,
    textMuted: tokens.colors.textSecondary,
    textSubtle: tokens.colors.textMuted,
    surface: tokens.colors.surface,
    surfaceRaised: tokens.colors.surfaceRaised,
};

export const Wrapper = styled.div`
    padding: 32px 40px;
    max-width: 1100px;
    margin: 0 auto;
    font-family: ${tokens.font.body};

    @media (max-width: 768px) {
        padding: 20px;
    }
`;

export const HeaderRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    gap: 12px;
    flex-wrap: wrap;
`;

export const Title = styled.h1`
    font-family: ${tokens.font.display};
    font-size: 26px;
    font-weight: 700;
    color: ${colors.text};
    margin: 0;
`;

export const Subtitle = styled.p`
    font-size: 13px;
    color: ${colors.textMuted};
    margin: 4px 0 0;
`;

export const AddGoalButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 18px;
    background: ${colors.primary};
    color: ${tokens.colors.bg};
    border: none;
    border-radius: ${tokens.radius.md};
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;

    &:hover {
        opacity: 0.9;
    }
`;

export const EmptyState = styled.div`
    text-align: center;
    padding: 64px 24px;
    border: 1px dashed ${colors.border};
    border-radius: ${tokens.radius.lg};
    color: ${colors.textMuted};
`;

/* --- Carousel --- */

export const CarouselViewport = styled.div`
    overflow: hidden;
    border-radius: ${tokens.radius.lg};
    border: 1px solid ${colors.border};
    background: ${colors.surface};
`;

export const CarouselTrack = styled.div`
    display: flex;
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    transform: translateX(-${(p) => p.$index * 100}%);
`;

export const CarouselSlide = styled.div`
    flex: 0 0 100%;
    max-width: 100%;
    padding: 28px 24px 20px;
`;

export const CarouselNav = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 14px;
`;

export const NavArrow = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid ${colors.border};
    background: ${colors.surface};
    cursor: pointer;
    color: ${colors.text};

    &:disabled {
        opacity: 0.35;
        cursor: default;
    }

    &:hover:not(:disabled) {
        background: ${colors.surfaceRaised};
    }
`;

export const Dots = styled.div`
    display: flex;
    gap: 6px;
`;

export const Dot = styled.button`
    width: ${(p) => (p.$active ? "20px" : "7px")};
    height: 7px;
    border-radius: 4px;
    border: none;
    background: ${(p) => (p.$active ? colors.primary : colors.borderSubtle)};
    cursor: pointer;
    transition: width 0.2s ease;
`;

/* --- Mountain scene --- */

export const GoalHeaderRow = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 8px;
    gap: 8px;
`;

export const GoalTitle = styled.h2`
    font-family: ${tokens.font.display};
    font-size: 18px;
    font-weight: 700;
    color: ${colors.text};
    margin: 0;
`;

export const GoalMeta = styled.span`
    font-size: 12px;
    color: ${colors.textSubtle};
    font-family: ${tokens.font.mono};
    white-space: nowrap;
`;

export const MountainSvgBox = styled.div`
    width: 100%;
    aspect-ratio: 4 / 3;
    max-height: 340px;
`;

export const StepList = styled.ul`
    list-style: none;
    margin: 18px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

export const StepRow = styled.li`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: ${tokens.radius.md};
    background: ${(p) => (p.$active ? colors.primaryLight : "transparent")};
    cursor: pointer;

    &:hover {
        background: ${colors.surfaceRaised};
    }
`;

export const StepCheck = styled.span`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    flex: 0 0 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid ${(p) => (p.$done ? colors.success : colors.border)};
    background: ${(p) => (p.$done ? colors.success : "transparent")};
    color: ${tokens.colors.bg};
`;

export const StepTitle = styled.span`
    font-size: 13.5px;
    color: ${(p) => (p.$done ? colors.textMuted : colors.text)};
    text-decoration: ${(p) => (p.$done ? "line-through" : "none")};
`;

export const StepStage = styled.span`
    margin-left: auto;
    font-size: 11px;
    color: ${colors.textSubtle};
    font-family: ${tokens.font.mono};
    white-space: nowrap;
`;

export const AddStepRow = styled.form`
    display: flex;
    gap: 8px;
    margin-top: 10px;
`;

export const AddStepInput = styled.input`
    flex: 1;
    padding: 8px 12px;
    border-radius: ${tokens.radius.md};
    border: 1px solid ${colors.border};
    background: ${colors.surface};
    color: ${colors.text};
    font-size: 13px;

    &:focus {
        outline: none;
        border-color: ${colors.primary};
    }
`;

export const AddStepBtn = styled.button`
    padding: 8px 14px;
    border-radius: ${tokens.radius.md};
    border: 1px solid ${colors.border};
    background: ${colors.surfaceRaised};
    color: ${colors.text};
    font-size: 13px;
    cursor: pointer;

    &:hover {
        background: ${colors.primaryLight};
    }
`;

export const AiButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 14px;
    border-radius: ${tokens.radius.md};
    border: 1px solid ${colors.primary};
    background: ${colors.primaryLight};
    color: ${colors.text};
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 6px;

    &:disabled {
        opacity: 0.6;
        cursor: default;
    }
`;

export const ErrorText = styled.div`
    font-size: 12.5px;
    color: ${tokens.colors.danger};
    margin-top: 8px;
`;

export const GeneratedList = styled.ul`
    list-style: none;
    margin: 14px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 220px;
    overflow-y: auto;
`;

export const GeneratedRow = styled.li`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: ${tokens.radius.md};
    background: ${colors.surfaceRaised};
    font-size: 13px;
`;

export const GeneratedRowText = styled.div`
    flex: 1;
`;

export const GeneratedRowStage = styled.div`
    font-size: 11px;
    color: ${colors.textSubtle};
    font-family: ${tokens.font.mono};
`;

export const RemoveStepBtn = styled.button`
    border: none;
    background: none;
    color: ${colors.textSubtle};
    cursor: pointer;
    padding: 2px;
    display: flex;

    &:hover {
        color: ${tokens.colors.danger};
    }
`;

/* --- Modal (create goal) --- */

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
    background: ${colors.surface};
    border: 1px solid ${colors.border};
    border-radius: ${tokens.radius.lg};
    width: 100%;
    max-width: 440px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
`;

export const ModalPad = styled.div`
    padding: 28px 28px 22px;
`;

export const ModalTitle = styled.h3`
    margin: 0 0 18px;
    font-family: ${tokens.font.display};
    font-size: 17px;
    font-weight: 700;
    color: ${colors.text};
`;

export const FieldLabel = styled.label`
    display: block;
    font-size: 12px;
    color: ${colors.textMuted};
    margin: 14px 0 6px;
`;

export const TextInput = styled.input`
    width: 100%;
    padding: 10px 12px;
    border-radius: ${tokens.radius.md};
    border: 1px solid ${colors.border};
    background: ${colors.surface};
    color: ${colors.text};
    font-size: 14px;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: ${colors.primary};
    }
`;

export const TemplateGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

export const TemplateOption = styled.button`
    text-align: left;
    padding: 10px 12px;
    border-radius: ${tokens.radius.md};
    border: 1.5px solid ${(p) => (p.$active ? colors.primary : colors.border)};
    background: ${(p) => (p.$active ? colors.primaryLight : "transparent")};
    cursor: pointer;
    font-size: 13px;
    color: ${colors.text};
`;

export const ModalActions = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 20px;
`;

export const SecondaryButton = styled.button`
    flex: 1;
    padding: 10px 16px;
    border-radius: ${tokens.radius.md};
    border: 1px solid ${colors.border};
    background: transparent;
    color: ${colors.text};
    cursor: pointer;
    font-size: 13px;
`;

export const PrimaryButton = styled.button`
    flex: 1;
    padding: 10px 16px;
    border-radius: ${tokens.radius.md};
    border: none;
    background: ${colors.primary};
    color: ${tokens.colors.bg};
    font-weight: 600;
    cursor: pointer;
    font-size: 13px;

    &:disabled {
        opacity: 0.5;
        cursor: default;
    }
`;
