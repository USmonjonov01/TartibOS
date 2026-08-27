import styled, { keyframes } from "styled-components";
import { tokens } from "../../theme/tokens";

export const colors = tokens.colors;
export const font = tokens.font;

const cardShadow = "0 1px 2px rgba(0, 0, 0, 0.3)";

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
`;

/* ---------- Shell (Statistics bilan bir xil) ---------- */

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

export const HeaderRow = styled.div`
    margin-bottom: 28px;
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
    max-width: 560px;
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
    color: #f0a99e;
    border: 1px solid rgba(200, 92, 78, 0.35);
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 13px;
    margin-bottom: 20px;
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

export const SectionCard = styled.div`
    background: ${colors.surface};
    border: 1px solid ${colors.hairline};
    border-radius: ${tokens.radius.lg};
    padding: 24px 24px;
    margin-bottom: 24px;
    box-shadow: ${cardShadow};
    animation: ${fadeUp} 0.4s ease both;

    @media (max-width: 640px) {
        padding: 16px;
    }
`;

export const SectionHead = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 18px;
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

/* ---------- Weeks list ---------- */

export const WeekList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

export const WeekRow = styled.button`
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 14px 12px;
    border: none;
    background: transparent;
    border-bottom: 1px solid ${colors.hairlineSoft};
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    transition: background 0.15s;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: ${colors.surfaceRaised};
        transform: translateX(2px);
    }
`;

export const WeekRowMain = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
`;

export const WeekRange = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: ${colors.textPrimary};
    white-space: nowrap;
`;

export const WeekIdTag = styled.div`
    font-family: ${font.mono};
    font-size: 11px;
    color: ${colors.textMuted};
    white-space: nowrap;
`;

export const WeekBadgeCurrent = styled.span`
    font-family: ${font.mono};
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: ${colors.amber};
    background: ${colors.amberSoft};
    padding: 2px 8px;
    border-radius: 10px;
    white-space: nowrap;
`;

export const WeekTrackedTag = styled.div`
    font-size: 12px;
    color: ${colors.textMuted};
    white-space: nowrap;
    flex-shrink: 0;

    @media (max-width: 560px) {
        display: none;
    }
`;

export const WeekPctBadge = styled.div`
    font-family: ${font.mono};
    font-size: 14px;
    font-weight: 700;
    color: ${(p) => p.$color};
    width: 46px;
    text-align: right;
    flex-shrink: 0;
`;

/* ---------- Detail view ---------- */

export const BackRow = styled.div`
    margin-bottom: 16px;
    animation: ${fadeUp} 0.4s ease both;
`;

export const BackButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    border: none;
    color: ${colors.textMuted};
    font-size: 13px;
    font-family: inherit;
    cursor: pointer;
    padding: 6px 0;
    transition: color 0.15s;

    &:hover {
        color: ${colors.textPrimary};
    }
`;

export const NoticeBanner = styled.div`
    background: linear-gradient(135deg, ${colors.surfaceRaised} 0%, ${colors.surface} 100%);
    border: 1px solid ${colors.hairline};
    border-radius: ${tokens.radius.md};
    padding: 14px 18px;
    margin-bottom: 20px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 13px;
    color: ${colors.textSecondary};
    line-height: 1.6;

    strong {
        color: ${colors.amber};
    }
`;

/* ---------- Grid table ---------- */

export const TableScroll = styled.div`
    width: 100%;
    overflow-x: auto;
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    min-width: 640px;
`;

export const Th = styled.th`
    text-align: left;
    padding: 8px 10px;
    font-weight: 500;
`;

export const ThDay = styled.th`
    text-align: center;
    padding: 8px 6px;
    width: 60px;
`;

export const ThDayName = styled.div`
    font-family: ${font.mono};
    font-size: 11px;
    font-weight: 700;
    color: ${(p) => (p.$isToday ? colors.amber : colors.textMuted)};
`;

export const ThDayDate = styled.div`
    font-size: 10px;
    color: ${colors.textMuted};
    margin-top: 2px;
`;

export const Tr = styled.tr`
    border-bottom: 1px solid ${colors.hairlineSoft};

    &:last-child {
        border-bottom: none;
    }
`;

export const TdHabit = styled.td`
    padding: 10px;
    min-width: 160px;
`;

export const HabitCellInner = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const HabitIconSpan = styled.span`
    font-size: 14px;
    flex-shrink: 0;
`;

export const HabitNameSpan = styled.span`
    font-size: 13px;
    color: ${colors.textPrimary};
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const Td = styled.td`
    text-align: center;
    padding: 8px 6px;
`;

export const DayCellWrap = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
`;

/* state: "done" | "excused" | "missed" | null */
export const DayCheckBtn = styled.button`
    width: 30px;
    height: 30px;
    border-radius: 7px;
    border: 1px solid ${(p) =>
        p.$state === "done"
            ? colors.success
            : p.$state === "excused"
            ? colors.amber
            : p.$state === "missed"
            ? colors.danger
            : colors.hairline};
    background: ${(p) =>
        p.$state === "done"
            ? colors.successSoft
            : p.$state === "excused"
            ? colors.amberSoft
            : p.$state === "missed"
            ? colors.dangerSoft
            : "transparent"};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: ${(p) => (p.disabled ? "default" : "pointer")};
    transition: all 0.12s;
    opacity: ${(p) => (p.$pending ? 0.5 : 1)};
    font-size: 13px;

    &:not(:disabled):hover {
        border-color: ${colors.amber};
        transform: scale(1.08);
    }
`;

export const DashCell = styled.div`
    color: ${colors.textMuted};
    font-size: 13px;
`;

export const FutureCell = styled.div`
    font-family: ${font.mono};
    font-size: 9.5px;
    color: ${colors.textMuted};
    opacity: 0.6;
`;

/* ---------- Summary row ---------- */

export const SummaryRow = styled.div`
    display: flex;
    gap: 6px;
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid ${colors.hairlineSoft};
`;

export const SummaryCell = styled.div`
    flex: 1;
    text-align: center;
`;

export const SummaryPct = styled.div`
    font-family: ${font.mono};
    font-size: 12px;
    font-weight: 700;
    color: ${(p) => p.$color};
`;

/* ---------- Legend strip ---------- */

export const LegendStrip = styled.div`
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 14px;
    font-size: 12px;
    color: ${colors.textMuted};
`;

export const LegendItem = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`;

export const LegendDot = styled.span`
    display: inline-flex;
    width: 14px;
    height: 14px;
    border-radius: 4px;
    background: ${(p) => p.$bg};
    border: 1px solid ${(p) => p.$border};
    align-items: center;
    justify-content: center;
    font-size: 9px;
    flex-shrink: 0;
`;

/* ---------- Reason Modal ---------- */

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
    background: ${colors.surface};
    border: 1px solid ${colors.hairline};
    border-radius: ${tokens.radius.lg};
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
    padding: 32px 32px 24px;
    width: 100%;
    max-width: 400px;
    animation: ${fadeUp} 0.25s ease both;
`;

export const ModalTitle = styled.h3`
    font-family: ${font.display};
    font-size: 16px;
    font-weight: 700;
    color: ${colors.textPrimary};
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
    background: ${colors.surfaceRaised};
    border: 1px solid ${colors.hairline};
    border-radius: 8px;
    color: ${colors.textPrimary};
    font-family: ${font.body};
    font-size: 13px;
    padding: 10px 12px;
    box-sizing: border-box;
    resize: vertical;
    outline: none;
    transition: border-color 0.15s;

    &:focus {
        border-color: ${colors.amber};
    }

    &::placeholder {
        color: ${colors.textMuted};
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
    background: ${(p) => (p.$primary ? colors.amber : "transparent")};
    color: ${(p) => (p.$primary ? "#0d0d0d" : colors.textMuted)};
    border-color: ${(p) => (p.$primary ? colors.amber : colors.hairline)};

    &:hover {
        opacity: 0.85;
    }
`;