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
    max-width: 1280px;
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

/* --- Carousel ---
   Bu "karta" endi shunchaki ma'lumot qutisi emas — foydalanuvchi o'z
   o'sishini ko'radigan MUHIT. Shu sabab yumshoq "osmon" gradienti,
   kattaroq radius va kengroq bo'shliq berilgan — zinapoya va
   bosqichlar ro'yxati shu bitta uzluksiz sahna ichida yashaydi. */

export const CarouselViewport = styled.div`
    overflow: hidden;
    border-radius: ${tokens.radius.xl || "22px"};
    border: 1px solid ${colors.borderSubtle};
    background: linear-gradient(180deg, ${colors.primaryLight} 0%, ${colors.surface} 320px, ${colors.surface} 100%);
`;

export const CarouselTrack = styled.div`
    display: flex;
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    transform: translateX(-${(p) => p.$index * 100}%);
`;

export const CarouselSlide = styled.div`
    flex: 0 0 100%;
    max-width: 100%;
    padding: 36px 36px 28px;

    @media (max-width: 640px) {
        padding: 24px 18px 20px;
    }
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

/* --- Staircase scene --- */

export const GoalHeaderRow = styled.div`
    display: flex;
    align-items: flex-start;
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

export const StaircaseSvgBox = styled.div`
    width: 100%;
    height: 460px;
    position: relative;
    border-radius: ${tokens.radius.lg};
    overflow: hidden;

    @media (max-width: 640px) {
        height: 340px;
    }
`;

/* Zinapoyaning o'zi shu ichida gorizontal (kerak bo'lsa vertikal ham)
   scroll qilinadi — pog'onalar soni ko'paysa ham hech biri kichraymaydi,
   buning o'rniga sahna kengayadi va foydalanuvchi uni scroll qilib
   ko'radi. CelebrateOverlay bundan tashqarida turadi (StaircaseSvgBox'ga
   bevosita bog'langan), shuning uchun scroll paytida joyidan siljimaydi. */
export const StaircaseScrollArea = styled.div`
    width: 100%;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: ${colors.border} transparent;

    &::-webkit-scrollbar {
        height: 8px;
        width: 8px;
    }
    &::-webkit-scrollbar-thumb {
        background: ${colors.border};
        border-radius: 4px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
`;

/* --- Level badge + XP bar (o'yinsimon holat paneli) --- */

export const LevelPanel = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 14px;
    padding: 12px 16px;
    border-radius: ${tokens.radius.lg};
    background: linear-gradient(135deg, ${colors.primaryLight} 0%, transparent 100%);
    border: 1px solid ${colors.border};
`;

export const LevelBadge = styled.div`
    width: 52px;
    height: 52px;
    border-radius: 14px;
    flex: 0 0 52px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(160deg, ${colors.primary} 0%, ${tokens.colors.amberStrong} 100%);
    box-shadow: 0 6px 18px ${colors.primaryLight};
`;

export const LevelBadgeLabel = styled.span`
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: ${tokens.colors.bg};
    opacity: 0.85;
    text-transform: uppercase;
`;

export const LevelBadgeNum = styled.span`
    font-family: ${tokens.font.mono};
    font-size: 20px;
    font-weight: 800;
    color: ${tokens.colors.bg};
    line-height: 1;
`;

export const XPBarWrap = styled.div`
    flex: 1;
    min-width: 0;
`;

export const XPBarTopRow = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 6px;
    gap: 8px;
`;

export const XPBarStage = styled.div`
    font-size: 13px;
    font-weight: 700;
    color: ${colors.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const XPBarCount = styled.div`
    font-family: ${tokens.font.mono};
    font-size: 11.5px;
    color: ${colors.textSubtle};
    white-space: nowrap;
`;

export const XPBarTrack = styled.div`
    width: 100%;
    height: 9px;
    border-radius: 6px;
    background: ${colors.borderSubtle};
    overflow: hidden;
`;

export const XPBarFill = styled.div`
    height: 100%;
    border-radius: 6px;
    width: ${(p) => p.$pct}%;
    background: linear-gradient(90deg, ${tokens.colors.amberStrong} 0%, ${colors.primary} 100%);
    transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
`;

/* --- "LEVEL UP!" portlash animatsiyasi (bosqich bajarilganda) --- */

export const CelebrateOverlay = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 5;
    opacity: ${(p) => (p.$show ? 1 : 0)};
    transition: opacity 0.25s ease;
`;

export const CelebrateBurst = styled.div`
    font-size: 42px;
    font-weight: 900;
    font-family: ${tokens.font.display};
    letter-spacing: -0.01em;
    color: ${colors.primary};
    text-shadow: 0 4px 24px ${colors.primaryLight};
    animation: ${(p) => (p.$show ? "tos-levelup-pop 1.1s cubic-bezier(0.22, 1, 0.36, 1)" : "none")};

    @keyframes tos-levelup-pop {
        0% { transform: scale(0.4) translateY(10px); opacity: 0; }
        35% { transform: scale(1.15) translateY(0); opacity: 1; }
        55% { transform: scale(1); }
        80% { transform: scale(1); opacity: 1; }
        100% { transform: scale(1.05); opacity: 0; }
    }
`;

export const CelebrateSub = styled.div`
    margin-top: 6px;
    font-size: 13px;
    font-weight: 600;
    color: ${colors.text};
    background: ${colors.surface};
    border: 1px solid ${colors.border};
    padding: 4px 14px;
    border-radius: 20px;
    opacity: ${(p) => (p.$show ? 1 : 0)};
    transform: translateY(${(p) => (p.$show ? "0" : "6px")});
    transition: opacity 0.3s ease 0.15s, transform 0.3s ease 0.15s;
`;

export const ConfettiPiece = styled.span`
    position: absolute;
    top: 40%;
    left: 50%;
    width: 7px;
    height: 10px;
    background: ${(p) => p.$color};
    border-radius: 2px;
    opacity: ${(p) => (p.$show ? 1 : 0)};
    animation: ${(p) => (p.$show ? `tos-confetti-fly 0.9s ease-out forwards` : "none")};
    animation-delay: ${(p) => p.$delay}s;
    --tx: ${(p) => p.$x}px;
    --ty: ${(p) => p.$y}px;
    --rot: ${(p) => p.$rot}deg;

    @keyframes tos-confetti-fly {
        0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; }
        100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(var(--rot)); opacity: 0; }
    }
`;

export const StepList = styled.ul`
    list-style: none;
    margin: 26px 0 0;
    padding: 0 4px 0 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 350px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: ${colors.border} transparent;

    &::-webkit-scrollbar {
        width: 8px;
    }
    &::-webkit-scrollbar-thumb {
        background: ${colors.border};
        border-radius: 4px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
`;

export const StepRow = styled.li`
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 8px 12px;
    padding: 15px 16px;
    border-radius: ${tokens.radius.md};
    background: ${(p) => (p.$next ? colors.primaryLight : p.$active ? colors.primaryLight : "transparent")};
    border: 1.5px solid ${(p) => (p.$next ? colors.primary : "transparent")};
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;

    &:hover {
        background: ${colors.surfaceRaised};
    }
`;

export const NextBadge = styled.span`
    margin-left: auto;
    flex-shrink: 0;
    font-family: ${tokens.font.mono};
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${tokens.colors.bg};
    background: ${colors.primary};
    padding: 3px 9px;
    border-radius: 12px;
`;

export const StepCheck = styled.span`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    flex: 0 0 24px;
    margin-top: 1px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 2px solid ${(p) => (p.$done ? colors.success : p.$next ? colors.primary : colors.border)};
    background: ${(p) => (p.$done ? colors.success : "transparent")};
    color: ${tokens.colors.bg};
`;

export const StepTitle = styled.span`
    flex: 1 1 180px;
    min-width: 0;
    font-size: 14px;
    line-height: 1.4;
    word-break: break-word;
    font-weight: ${(p) => (p.$next ? 700 : 500)};
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

/* --- Goal menu (rename / archive / delete) --- */

export const MenuWrap = styled.div`
    position: relative;
`;

export const MenuButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: ${tokens.radius.md};
    border: none;
    background: transparent;
    color: ${colors.textSubtle};
    cursor: pointer;

    &:hover {
        background: ${colors.surfaceRaised};
        color: ${colors.text};
    }
`;

export const MenuDropdown = styled.div`
    position: absolute;
    top: 32px;
    right: 0;
    min-width: 170px;
    background: ${colors.surface};
    border: 1px solid ${colors.border};
    border-radius: ${tokens.radius.md};
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    z-index: 20;
    overflow: hidden;
`;

export const MenuItem = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 10px 14px;
    background: none;
    border: none;
    text-align: left;
    font-size: 13px;
    color: ${(p) => (p.$danger ? tokens.colors.danger : colors.text)};
    cursor: pointer;

    &:hover {
        background: ${(p) => (p.$danger ? tokens.colors.dangerSoft : colors.surfaceRaised)};
    }
`;

export const RenameInput = styled.input`
    font-family: ${tokens.font.display};
    font-size: 18px;
    font-weight: 700;
    color: ${colors.text};
    background: transparent;
    border: none;
    border-bottom: 1.5px solid ${colors.primary};
    padding: 0 0 2px;
    outline: none;
    width: 100%;
`;

/* --- Step hover actions --- */

export const StepActions = styled.div`
    display: flex;
    align-items: center;
    gap: 2px;
    opacity: 0.45;
    transition: opacity 0.12s ease;

    &:hover {
        opacity: 1;
    }
`;

export const StepIconBtn = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: ${tokens.radius.sm || "6px"};
    border: none;
    background: transparent;
    color: ${colors.textSubtle};
    cursor: pointer;

    &:hover {
        background: ${colors.borderSubtle};
        color: ${(p) => (p.$danger ? tokens.colors.danger : colors.text)};
    }
`;

export const StepEditInput = styled.input`
    flex: 1;
    padding: 4px 8px;
    border-radius: ${tokens.radius.sm || "6px"};
    border: 1px solid ${colors.primary};
    background: ${colors.surface};
    color: ${colors.text};
    font-size: 13.5px;

    &:focus {
        outline: none;
    }
`;

/* --- Archived goals section --- */

export const ArchivedSection = styled.div`
    margin-top: 28px;
`;

export const ArchivedToggle = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    color: ${colors.textMuted};
    font-size: 13px;
    cursor: pointer;
    padding: 4px 0;

    &:hover {
        color: ${colors.text};
    }
`;

export const ArchivedList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 10px;
`;

export const ArchivedRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: ${tokens.radius.md};
    border: 1px solid ${colors.border};
    background: ${colors.surface};
`;

export const ArchivedInfo = styled.div`
    flex: 1;
`;

export const ArchivedTitle = styled.div`
    font-size: 13.5px;
    color: ${colors.text};
    font-weight: 600;
`;

export const ArchivedMeta = styled.div`
    font-size: 11.5px;
    color: ${colors.textSubtle};
    margin-top: 1px;
`;

export const SmallGhostButton = styled.button`
    padding: 6px 12px;
    border-radius: ${tokens.radius.sm || "6px"};
    border: 1px solid ${colors.border};
    background: transparent;
    color: ${colors.text};
    font-size: 12px;
    cursor: pointer;

    &:hover {
        background: ${colors.surfaceRaised};
    }
`;

export const SmallDangerButton = styled(SmallGhostButton)`
    border-color: ${tokens.colors.danger};
    color: ${tokens.colors.danger};

    &:hover {
        background: ${tokens.colors.dangerSoft};
    }
`;

export const CompletedBanner = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 14px;
    margin-bottom: 12px;
    border-radius: ${tokens.radius.md};
    background: ${colors.successLight};
    border: 1px solid ${colors.success};
    font-size: 13px;
    color: ${colors.text};
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