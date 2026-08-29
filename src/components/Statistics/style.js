import styled, { keyframes } from "styled-components";
import { tokens } from "../../theme/tokens";

export const colors = tokens.colors;
export const font = tokens.font;

const cardShadow = "0 1px 2px rgba(0, 0, 0, 0.3)";

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
`;

export const Wrapper = styled.div`
    min-height: 100vh;
    background: radial-gradient(ellipse 900px 500px at 15% -10%, ${colors.surfaceRaised} 0%, ${colors.bg} 55%);
    padding: 40px 40px 64px;
    font-family: ${font.body};
    color: ${colors.textPrimary};

    @media (max-width: 768px) {
        padding: 24px 16px 48px;
    }
`;

export const Inner = styled.div`
    max-width: 1080px;
    margin: 0 auto;
`;

/* ---------- Header ---------- */

export const HeaderRow = styled.div`
    margin-bottom: 32px;
    animation: ${fadeUp} 0.4s ease both;
`;

export const Eyebrow = styled.div`
    font-family: ${font.mono};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: ${colors.amber};
    text-transform: uppercase;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
        content: "";
        width: 16px;
        height: 1px;
        background: ${colors.amber};
    }
`;

export const Title = styled.h1`
    font-family: ${font.display};
    font-size: 30px;
    font-weight: 700;
    color: ${colors.textPrimary};
    margin: 0;
    letter-spacing: -0.02em;
`;

export const Subtitle = styled.p`
    margin: 6px 0 0;
    color: ${colors.textSecondary};
    font-size: 14px;
    max-width: 520px;
    line-height: 1.6;
`;

export const StatusText = styled.div`
    padding: 60px 0;
    text-align: center;
    color: ${colors.textMuted};
    font-size: 14px;
    font-family: ${font.mono};
`;

export const ErrorBanner = styled.div`
    background: ${colors.dangerSoft};
    color: #F0A99E;
    border: 1px solid rgba(200, 92, 78, 0.35);
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 13px;
    margin-bottom: 24px;
`;

export const EmptyState = styled.div`
    text-align: center;
    padding: 80px 24px;
    background: ${colors.surface};
    border-radius: ${tokens.radius.lg};
    border: 1px solid ${colors.hairline};
    box-shadow: ${cardShadow};
`;

export const EmptyTitle = styled.div`
    font-family: ${font.display};
    font-size: 17px;
    font-weight: 600;
    color: ${colors.textPrimary};
    margin-bottom: 8px;
`;

export const EmptySub = styled.div`
    font-size: 13px;
    color: ${colors.textMuted};
    max-width: 380px;
    margin: 0 auto;
    line-height: 1.6;
`;

/* ---------- Confrontation hero: SIZ vs SIZ ---------- */

export const ConfrontCard = styled.div`
    background: linear-gradient(160deg, ${colors.surfaceRaised} 0%, ${colors.surface} 100%);
    border: 1px solid ${colors.hairline};
    border-radius: ${tokens.radius.lg};
    padding: 32px 32px;
    margin-bottom: 24px;
    position: relative;
    overflow: hidden;
    box-shadow: ${cardShadow};
    animation: ${fadeUp} 0.4s ease 0.05s both;

    &::after {
        content: "";
        position: absolute;
        top: -60px;
        right: -60px;
        width: 220px;
        height: 220px;
        background: radial-gradient(circle, ${colors.amberSoft} 0%, transparent 70%);
        pointer-events: none;
    }

    @media (max-width: 640px) {
        padding: 24px 16px;
    }
`;

export const ConfrontLabel = styled.div`
    font-family: ${font.mono};
    font-size: 11px;
    letter-spacing: 0.1em;
    color: ${colors.textMuted};
    text-transform: uppercase;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const ConfrontGrid = styled.div`
    display: flex;
    align-items: center;
    gap: 0;
    position: relative;

    @media (max-width: 560px) {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
    }
`;

export const ConfrontCol = styled.div`
    flex: 1;
    ${(p) => p.$dim && `opacity: 0.6;`}
`;

export const ConfrontWho = styled.div`
    font-size: 12px;
    color: ${(p) => (p.$muted ? colors.textMuted : colors.amber)};
    font-weight: 600;
    margin-bottom: 6px;
`;

export const ConfrontDivider = styled.div`
    width: 1px;
    align-self: stretch;
    background: ${colors.hairline};
    margin: 0 28px;
    position: relative;

    @media (max-width: 560px) {
        width: 100%;
        height: 1px;
        margin: 0;
    }
`;

export const ConfrontDeltaBadge = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 20px;
    font-family: ${font.mono};
    font-size: 15px;
    font-weight: 700;
    margin-top: 14px;
    background: ${(p) => p.$bg};
    color: ${(p) => p.$color};
`;

export const ConfrontNote = styled.div`
    font-size: 12px;
    color: ${colors.textMuted};
    margin-top: 14px;
    line-height: 1.5;
`;

/* ---------- KPI strip ---------- */

export const KpiGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 28px;

    @media (max-width: 860px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

export const KpiLabel = styled.div`
    font-family: ${font.mono};
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: ${colors.textMuted};
    margin-bottom: 10px;
`;

export const KpiTrendRow = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    flex-wrap: wrap;
`;

export const KpiTrendValue = styled.span`
    font-family: ${font.mono};
    font-weight: 700;
    color: ${(p) => p.$color};
`;

export const KpiInsight = styled.span`
    color: ${colors.textMuted};
`;

/* ---------- Sections (shared card shell) ---------- */

export const SectionCard = styled.div`
    background: ${colors.surface};
    border: 1px solid ${colors.hairline};
    border-radius: ${tokens.radius.lg};
    padding: 24px 24px;
    margin-bottom: 24px;
    box-shadow: ${cardShadow};
    animation: ${fadeUp} 0.4s ease both;

    @media (max-width: 640px) {
        padding: 20px;
    }
`;

export const SectionHead = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
`;

export const SectionTitle = styled.h2`
    font-family: ${font.display};
    font-size: 16px;
    font-weight: 600;
    color: ${colors.textPrimary};
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const SectionCaption = styled.div`
    font-size: 12px;
    color: ${colors.textMuted};
    margin-top: 2px;
`;

export const TwoColGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: stretch;

    @media (max-width: 860px) {
        grid-template-columns: 1fr;
    }
`;

/* ---------- Ascent chart (signature element) ---------- */

export const AscentWrap = styled.div`
    width: 100%;
    overflow-x: auto;
`;

export const AscentCaption = styled.div`
    font-size: 12px;
    color: ${colors.textMuted};
    margin-top: 12px;
    line-height: 1.6;
`;

/* ---------- Daily bars (this week) ---------- */

export const DayChartRow = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 10px;
    height: 140px;
    padding-top: 8px;
`;

export const DayCol = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    height: 100%;
    justify-content: flex-end;
`;

export const DayBarTrack = styled.div`
    width: 100%;
    max-width: 30px;
    height: 100px;
    display: flex;
    align-items: flex-end;
    background: ${colors.hairlineSoft};
    border-radius: 5px;
    overflow: hidden;
`;

export const DayBarFill = styled.div`
    width: 100%;
    height: ${(p) => p.$pct}%;
    background: ${(p) => (p.$isToday ? colors.amber : colors.steelPast)};
    border-radius: 5px 5px 0 0;
    transition: height 0.5s ease;
`;

export const DayLabel = styled.div`
    font-family: ${font.mono};
    font-size: 10px;
    font-weight: 600;
    color: ${(p) => (p.$isToday ? colors.amber : colors.textMuted)};
`;

/* ---------- Habit roster ---------- */

export const RosterList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 260px;
    overflow-y: auto;
    padding-right: 6px;

    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background: ${colors.hairline};
        border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
        background: ${colors.amber};
    }
`;

export const RosterRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: ${tokens.radius.md};
    background: ${colors.surfaceRaised};
    border: 1px solid ${colors.hairlineSoft};
    transition: all 0.2s ease;

    &:hover {
        border-color: ${colors.hairline};
        transform: translateX(2px);
    }

    /* Tor ekranlarda barcha qat'iy kengliklar (ism, ball, foiz) progress-bar
       uchun joy qoldirmay, qatorni siqib, "g'alati" ko'rinishga olib
       kelayotgan edi — shuning uchun bo'shliq va kengliklarni kamaytiramiz. */
    @media (max-width: 480px) {
        gap: 6px;
        padding: 8px;
    }
`;

export const RosterRank = styled.div`
    width: 20px;
    font-family: ${font.mono};
    font-size: 11px;
    font-weight: 700;
    color: ${(p) => p.$color || colors.textMuted};
    flex-shrink: 0;
    text-align: center;
`;

export const RosterIcon = styled.span`
    font-size: 14px;
    flex-shrink: 0;

    @media (max-width: 480px) {
        display: none;
    }
`;

export const RosterName = styled.div`
    width: 120px;
    min-width: 70px;
    font-size: 12.5px;
    font-weight: 500;
    color: ${colors.textPrimary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 0;

    @media (max-width: 480px) {
        width: 64px;
        min-width: 64px;
        font-size: 12px;
    }
`;

export const RosterBarTrack = styled.div`
    flex: 1;
    height: 6px;
    background: ${colors.hairlineSoft};
    border-radius: 3px;
    overflow: hidden;
`;

export const RosterBarFill = styled.div`
    height: 100%;
    width: ${(p) => p.$pct}%;
    background: ${(p) => p.$color};
    border-radius: 3px;
    transition: width 0.4s ease;
`;

export const RosterAvgScore = styled.div`
    display: flex;
    align-items: center;
    gap: 3px;
    font-family: ${font.mono};
    font-size: 11px;
    font-weight: 700;
    color: ${(p) => (p.$weak ? colors.danger : colors.amber)};
    flex-shrink: 0;
    width: 30px;

    @media (max-width: 480px) {
        width: 24px;
        font-size: 10px;
    }
`;

export const RosterPct = styled.div`
    width: 38px;
    text-align: right;
    font-family: ${font.mono};
    font-size: 12px;
    font-weight: 700;
    color: ${(p) => p.$color || colors.textSecondary};
    flex-shrink: 0;

    @media (max-width: 480px) {
        width: 30px;
        font-size: 11px;
    }
`;

/* ---------- Mission operations ---------- */

export const OpsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 20px;

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
`;

export const OpsStat = styled.div`
    background: ${colors.surfaceRaised};
    border-radius: ${tokens.radius.md};
    padding: 16px 16px;
`;

export const OpsLabel = styled.div`
    font-family: ${font.mono};
    font-size: 10px;
    letter-spacing: 0.06em;
    color: ${colors.textMuted};
    margin-bottom: 8px;
`;

export const OpsValue = styled.div`
    font-family: ${font.mono};
    font-size: 22px;
    font-weight: 700;
    color: ${colors.textPrimary};
`;

export const PriorityStripTrack = styled.div`
    display: flex;
    width: 100%;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    background: ${colors.hairlineSoft};
    margin-bottom: 12px;
`;

export const PriorityStripSeg = styled.div`
    height: 100%;
    width: ${(p) => p.$pct}%;
    background: ${(p) => p.$color};
    transition: width 0.5s ease;
`;

export const PriorityLegend = styled.div`
    display: flex;
    gap: 18px;
    flex-wrap: wrap;
`;

export const PriorityLegendItem = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: ${colors.textSecondary};
`;

export const PriorityDot = styled.span`
    width: 8px;
    height: 8px;
    border-radius: 2px;
    background: ${(p) => p.$color};
    flex-shrink: 0;
`;

/* ---------- Field notes / insights ---------- */

export const InsightList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
`;

export const InsightItem = styled.div`
    display: flex;
    gap: 12px;
    font-size: 13.5px;
    line-height: 1.65;
    color: ${colors.textSecondary};

    strong {
        color: ${colors.textPrimary};
        font-weight: 700;
    }
`;

export const InsightMarker = styled.div`
    font-family: ${font.mono};
    font-size: 11px;
    font-weight: 700;
    color: ${colors.amber};
    flex-shrink: 0;
    margin-top: 2px;
`;
