import styled, { keyframes } from "styled-components";
import { tokens } from "../../theme/tokens";

export const colors = {
    border: tokens.colors.hairline,
    borderSubtle: tokens.colors.hairlineSoft,
    primary: tokens.colors.amber,
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

export const Wrapper = styled.div`
    padding: 32px 40px;
    max-width: 1100px;
    margin: 0 auto;
    font-family: ${tokens.font.body};

    @media (max-width: 768px) {
        padding: 20px;
    }
`;

export const HeaderBlock = styled.div`
    margin-bottom: 32px;
`;

export const DateLabel = styled.div`
    font-family: ${tokens.font.mono};
    font-size: 12px;
    color: ${colors.textSubtle};
    margin-bottom: 4px;
    font-weight: 500;
    letter-spacing: 0.02em;
`;

export const Greeting = styled.h1`
    font-family: ${tokens.font.display};
    font-size: 28px;
    font-weight: 700;
    color: ${colors.text};
    margin: 0;
    letter-spacing: -0.02em;

    @media (max-width: 480px) {
        font-size: 22px;
    }
`;

export const TopGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;

    @media (max-width: 900px) {
        grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 560px) {
        grid-template-columns: 1fr;
    }
`;

export const Card = styled.div`
    background: ${tokens.colors.surface};
    border: 1px solid ${colors.border};
    border-radius: ${tokens.radius.md};
    padding: 24px;
`;

export const DisciplineCardWrap = styled(Card)`
    display: flex;
    align-items: center;
    gap: 20px;
`;

export const DisciplineLabel = styled.div`
    font-family: ${tokens.font.mono};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: ${colors.textSubtle};
    margin-bottom: 4px;
`;

export const DisciplineValue = styled.div`
    font-size: 22px;
    font-weight: 700;
    color: ${colors.text};
    margin-bottom: 4px;
    font-family: ${tokens.font.mono};
`;

export const DisciplineSub = styled.div`
    font-size: 13px;
    color: ${(p) => (p.$done ? colors.success : colors.textMuted)};
`;

export const StatCardWrap = styled(Card)``;

export const StatHead = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
`;

export const StatLabel = styled.div`
    font-family: ${tokens.font.mono};
    font-size: 11px;
    font-weight: 600;
    color: ${colors.textSubtle};
    letter-spacing: 0.05em;
`;

export const StatIconBox = styled.div`
    padding: 6px 8px;
    border-radius: 8px;
    background: ${(p) => p.$bg};
    display: flex;
`;

export const StatValue = styled.div`
    font-size: 26px;
    font-weight: 700;
    color: ${colors.text};
    font-family: ${tokens.font.mono};
    margin-bottom: 4px;
`;

export const StatSub = styled.div`
    font-size: 13px;
    color: ${(p) => p.$color};
    font-weight: 500;
`;

export const MainGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 24px;

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

export const Col = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 0;
`;

export const SectionCard = styled.div`
    background: ${tokens.colors.surface};
    border: 1px solid ${colors.border};
    border-radius: ${tokens.radius.md};
    overflow: hidden;
`;

export const SectionHeader = styled.div`
    padding: 20px 24px 16px;
    border-bottom: 1px solid ${colors.borderSubtle};
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
`;

export const SectionTitle = styled.h2`
    margin: 0;
    font-family: ${tokens.font.display};
    font-size: 16px;
    font-weight: 600;
    color: ${colors.text};
`;

export const SectionSubtitle = styled.p`
    margin: 2px 0 0;
    font-size: 12.5px;
    color: ${colors.textSubtle};
`;

export const CountBadge = styled.span`
    font-family: ${tokens.font.mono};
    font-size: 12px;
    background: ${(p) => p.$bg};
    color: ${(p) => p.$color};
    padding: 4px 10px;
    border-radius: 20px;
    font-weight: 700;
    white-space: nowrap;
`;

export const SectionBody = styled.div`
    padding: 8px 16px 16px;
`;

export const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.12s;
    opacity: ${(p) => (p.$done ? (p.$dim ?? 0.65) : 1)};

    &:hover {
        background: ${colors.hover};
    }
`;

export const RowEmoji = styled.span`
    font-size: 18px;
    flex-shrink: 0;
`;

export const RowBody = styled.div`
    flex: 1;
    min-width: 0;
`;

export const RowTitle = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: ${(p) => (p.$done ? colors.textSubtle : colors.text)};
    text-decoration: ${(p) => (p.$done ? "line-through" : "none")};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const RowNote = styled.div`
    font-size: 12px;
    color: ${colors.textSubtle};
    margin-top: 1px;
`;

/* Bugungi kun uchun maxsus vazifa — sarlavha yonida, chiziqcha bilan, ko'zga tashlanadigan rangda */
export const TodayPlanSpan = styled.span`
    font-weight: 600;
    color: ${colors.accent};
`;

export const RowMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
`;

export const PriorityDot = styled.div`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${(p) => p.$color};
    flex-shrink: 0;
`;

export const TimeTag = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    color: ${colors.textSubtle};
    font-family: ${tokens.font.mono};
    font-size: 11.5px;
    white-space: nowrap;
`;

export const EmptyState = styled.div`
    text-align: center;
    padding: 24px 16px;
`;

export const EmptyIcon = styled.div`
    font-size: 32px;
    margin-bottom: 8px;
    opacity: 0.7;
`;

export const EmptyTitle = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: ${colors.textMuted};
    margin-bottom: 4px;
`;

export const EmptySub = styled.div`
    font-size: 12px;
    color: ${colors.textSubtle};
`;

export const WeeklyHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

export const WeeklyTitle = styled.h2`
    margin: 0;
    font-family: ${tokens.font.display};
    font-size: 15px;
    font-weight: 600;
    color: ${colors.text};
`;

export const LegendRow = styled.div`
    display: flex;
    gap: 16px;
    font-size: 11px;
`;

export const LegendItem = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;

    span {
        color: ${colors.textMuted};
    }
`;

export const LegendDot = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 2px;
    background: ${(p) => p.$color};
`;

export const ChartRow = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 8px;
    height: 100px;
`;

export const ChartCol = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
`;

export const BarTrack = styled.div`
    width: 100%;
    display: flex;
    gap: 2px;
    height: 80px;
    align-items: flex-end;
    background: ${colors.borderSubtle};
    border-radius: 3px 3px 0 0;
`;

export const Bar = styled.div`
    flex: 1;
    background: ${(p) => p.$color};
    border-radius: 3px 3px 0 0;
    height: ${(p) => p.$height}px;
    opacity: ${(p) => p.$opacity ?? 0.9};
    transition: height 0.4s ease;
    min-height: 2px;
`;

export const DayTag = styled.span`
    font-family: ${tokens.font.mono};
    font-size: 10px;
    color: ${colors.textSubtle};
    font-weight: 500;
`;

export const InsightBox = styled.div`
    background: linear-gradient(135deg, ${tokens.colors.amberSoft} 0%, ${tokens.colors.surfaceRaised} 100%);
    border: 1px solid ${colors.border};
    border-radius: ${tokens.radius.md};
    padding: 20px 24px;
`;

export const InsightHead = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
`;

export const InsightLabel = styled.span`
    font-family: ${tokens.font.mono};
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: ${colors.primary};
`;

export const InsightText = styled.p`
    margin: 0 0 12px;
    font-size: 14px;
    color: ${colors.text};
    line-height: 1.6;

    strong {
        color: ${colors.primary};
    }
`;

export const InsightLink = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: ${colors.primary};
    font-weight: 600;
    cursor: pointer;
`;

export const StatusText = styled.div`
    padding: 40px 0;
    text-align: center;
    color: ${colors.textSubtle};
    font-family: ${tokens.font.mono};
    font-size: 14px;
`;

export const ErrorBanner = styled.div`
    background: ${tokens.colors.dangerSoft};
    color: #F0A99E;
    border: 1px solid rgba(200, 92, 78, 0.35);
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 13px;
    margin-bottom: 20px;
`;

/* ---------- Odat holati legendasi (History bilan bir xil uslub) ---------- */

export const HabitLegendRow = styled.div`
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    padding: 0 16px 10px;
    font-size: 11px;
`;

export const HabitLegendItem = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    color: ${colors.textSubtle};
`;

export const HabitLegendDot = styled.span`
    width: 15px;
    height: 15px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    flex-shrink: 0;
    background: ${(p) => p.$bg};
    border: 1px solid ${(p) => p.$border};
`;

/* ---------- Sabab modali (History bilan bir xil) ---------- */

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
`;

export const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 24px;
`;

export const ModalBox = styled.div`
    background: ${tokens.colors.surface};
    border: 1px solid ${colors.border};
    border-radius: ${tokens.radius.lg};
    padding: 28px 28px 24px;
    width: 100%;
    max-width: 400px;
    animation: ${fadeUp} 0.25s ease both;
`;

export const ModalTitle = styled.h3`
    font-family: ${tokens.font.display};
    font-size: 16px;
    font-weight: 700;
    color: ${colors.text};
    margin: 0 0 8px;
`;

export const ModalSubtitle = styled.p`
    font-size: 13px;
    color: ${colors.textMuted};
    margin: 0 0 16px;
    line-height: 1.5;
`;

export const ModalTextarea = styled.textarea`
    width: 100%;
    min-height: 90px;
    background: ${tokens.colors.surfaceRaised};
    border: 1px solid ${colors.border};
    border-radius: 8px;
    color: ${colors.text};
    font-family: ${tokens.font.body};
    font-size: 13px;
    padding: 10px 12px;
    box-sizing: border-box;
    resize: vertical;
    outline: none;
    transition: border-color 0.15s;

    &:focus {
        border-color: ${colors.primary};
    }

    &::placeholder {
        color: ${colors.textSubtle};
    }
`;

export const ModalActions = styled.div`
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 16px;
`;

export const ModalBtn = styled.button`
    padding: 8px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.15s;
    background: ${(p) => (p.$primary ? colors.primary : "transparent")};
    color: ${(p) => (p.$primary ? "#0d0d0d" : colors.textMuted)};
    border-color: ${(p) => (p.$primary ? colors.primary : colors.border)};

    &:hover {
        opacity: 0.85;
    }
`;

/* ---------- Yulduzcha baholash (0/2/4/6/8/10 ball) ---------- */

export const RatingStarsRow = styled.div`
    display: flex;
    gap: 6px;
    justify-content: center;
    margin: 18px 0 6px;
`;

export const RatingStarBtn = styled.button`
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    display: flex;
    line-height: 0;
    transition: transform 0.1s;

    &:hover {
        transform: scale(1.15);
    }
`;

export const RatingHint = styled.div`
    text-align: center;
    font-family: ${tokens.font.mono};
    font-size: 12px;
    color: ${(p) => (p.$weak ? colors.warning : colors.textSubtle)};
    min-height: 16px;
    margin-bottom: 4px;
`;

/* Qatorda ko'rsatiladigan kichik, bosilmaydigan yulduzchalar */
export const ScoreStarsRow = styled.div`
    display: flex;
    gap: 1px;
    flex-shrink: 0;
`;

