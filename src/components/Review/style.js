import styled, { keyframes } from "styled-components";
import { tokens } from "../../theme/tokens";

export const colors = tokens.colors;
export const font = tokens.font;

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
        padding: 24px 20px 48px;
    }
`;

export const Inner = styled.div`
    max-width: 760px;
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
    color: #f0a99e;
    border: 1px solid rgba(200, 92, 78, 0.35);
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 13px;
    margin-bottom: 20px;
`;

/* ---------- Mode toggle ---------- */

export const ModeTabs = styled.div`
    display: flex;
    gap: 4px;
    margin-bottom: 24px;
    background: ${colors.surface};
    border: 1px solid ${colors.hairline};
    padding: 4px;
    border-radius: 10px;
    width: fit-content;
    animation: ${fadeUp} 0.4s ease 0.05s both;
`;

export const ModeTab = styled.button`
    padding: 8px 22px;
    border-radius: 7px;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 13.5px;
    font-weight: 600;
    transition: all 0.15s;
    background: ${(p) => (p.$active ? colors.amberSoft : "transparent")};
    color: ${(p) => (p.$active ? colors.amber : colors.textMuted)};
`;

/* ---------- Info banner (bugungi sana / hafta oralig'i) ---------- */

export const InfoBanner = styled.div`
    background: linear-gradient(135deg, ${colors.surfaceRaised} 0%, ${colors.surface} 100%);
    border: 1px solid ${colors.hairline};
    border-radius: ${tokens.radius.lg};
    padding: 16px 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    animation: ${fadeUp} 0.4s ease 0.1s both;
`;

export const InfoBannerLabel = styled.span`
    font-size: 13.5px;
    font-weight: 600;
    color: ${colors.amber};
`;

export const InfoBannerDate = styled.span`
    font-family: ${font.mono};
    font-size: 12.5px;
    color: ${colors.textSecondary};
`;

/* ---------- Score cards ---------- */

export const ScoreGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 20px;

    @media (max-width: 520px) {
        grid-template-columns: 1fr;
    }
`;

export const ScoreCard = styled.div`
    background: ${colors.surface};
    border: 1px solid ${colors.hairline};
    border-radius: ${tokens.radius.md};
    padding: 16px 18px;
    animation: ${fadeUp} 0.4s ease both;
`;

export const ScoreCardLabel = styled.div`
    font-family: ${font.display};
    font-size: 13.5px;
    font-weight: 600;
    color: ${colors.textPrimary};
    margin-bottom: 2px;
`;

export const ScoreCardSub = styled.div`
    font-size: 11.5px;
    color: ${colors.textMuted};
    margin-bottom: 12px;
`;

export const ScoreButtonsRow = styled.div`
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
`;

export const ScoreButton = styled.button`
    flex: 1;
    height: 36px;
    border-radius: 7px;
    border: 1px solid ${(p) => (p.$active ? p.$color : colors.hairline)};
    cursor: pointer;
    font-family: ${font.mono};
    font-size: 14px;
    font-weight: 700;
    transition: all 0.12s;
    background: ${(p) => (p.$active ? p.$color : colors.surfaceRaised)};
    color: ${(p) => (p.$active ? colors.bg : colors.textMuted)};
`;

export const ScoreResultLabel = styled.div`
    font-size: 11.5px;
    font-weight: 600;
    color: ${(p) => p.$color};
    text-align: center;
`;

/* ---------- Text fields ---------- */

export const FieldStack = styled.div`
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-bottom: 8px;
`;

export const Field = styled.div`
    animation: ${fadeUp} 0.4s ease both;
`;

export const FieldLabel = styled.label`
    display: block;
    font-family: ${font.display};
    font-size: 13.5px;
    font-weight: 600;
    color: ${colors.textPrimary};
    margin-bottom: 8px;
`;

export const Textarea = styled.textarea`
    width: 100%;
    padding: 14px 16px;
    border: 1px solid ${colors.hairline};
    border-radius: ${tokens.radius.md};
    font-size: 14px;
    color: ${colors.textPrimary};
    font-family: ${font.body};
    line-height: 1.6;
    resize: vertical;
    outline: none;
    background: ${colors.surface};
    box-sizing: border-box;
    transition: border-color 0.15s;

    &::placeholder {
        color: ${colors.textMuted};
    }

    &:focus {
        border-color: ${colors.amber};
    }
`;

/* ---------- Auto insights (Statistics'dagi InsightList bilan bir xil) ---------- */

export const AutoInsightBox = styled.div`
    background: ${colors.surfaceRaised};
    border-radius: ${tokens.radius.md};
    padding: 16px 20px;
    border: 1px solid ${colors.hairlineSoft};
    margin-bottom: 20px;
`;

export const AutoInsightLabel = styled.div`
    font-family: ${font.mono};
    font-size: 10.5px;
    font-weight: 700;
    color: ${colors.textMuted};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 12px;
`;

export const InsightList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const InsightItem = styled.div`
    display: flex;
    gap: 10px;
    font-size: 13px;
    line-height: 1.6;
    color: ${colors.textSecondary};

    strong {
        color: ${colors.textPrimary};
        font-weight: 700;
    }
`;

export const InsightMarker = styled.div`
    font-family: ${font.mono};
    font-size: 10.5px;
    font-weight: 700;
    color: ${colors.amber};
    flex-shrink: 0;
    margin-top: 2px;
`;

/* ---------- Actions ---------- */

export const ActionsRow = styled.div`
    margin-top: 28px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
`;

export const SaveButton = styled.button`
    padding: 12px 30px;
    background: ${(p) => (p.$saved ? colors.success : colors.amber)};
    color: ${colors.bg};
    border: none;
    border-radius: 9px;
    font-size: 14.5px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.25s;
    display: flex;
    align-items: center;
    gap: 8px;
    opacity: ${(p) => (p.$disabled ? 0.6 : 1)};
`;

export const ClearButton = styled.button`
    padding: 12px 18px;
    background: transparent;
    color: ${colors.textMuted};
    border: 1px solid ${colors.hairline};
    border-radius: 9px;
    font-size: 13.5px;
    cursor: pointer;
    font-family: inherit;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.15s;

    &:hover {
        border-color: ${colors.textMuted};
        color: ${colors.textSecondary};
    }
`;

/* ---------- Tarix (History) bo'limi — ikkita ixcham skroll-wrapper ---------- */

export const HistorySection = styled.div`
    margin-top: 40px;
`;

export const HistorySectionTitle = styled.h2`
    font-family: ${font.display};
    font-size: 17px;
    font-weight: 700;
    color: ${colors.textPrimary};
    margin: 0 0 14px;
`;

export const HistoryGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
`;

export const HistoryCard = styled.div`
    background: ${colors.surface};
    border: 1px solid ${colors.hairline};
    border-radius: 14px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    min-width: 0;
`;

export const HistoryCardHead = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
`;

export const HistoryCardTitle = styled.h3`
    font-family: ${font.display};
    font-size: 13.5px;
    font-weight: 700;
    color: ${colors.textPrimary};
    margin: 0;
    display: flex;
    align-items: center;
    gap: 6px;
`;

export const HistoryCardCount = styled.span`
    font-family: ${font.mono};
    font-size: 11px;
    color: ${colors.textMuted};
    background: ${colors.surfaceRaised};
    padding: 2px 8px;
    border-radius: 10px;
`;

// Talab qilingan tarzda: overflow: scroll, ixcham va sobit balandlikda —
// tarix uzaysa ham kartochka o'lchami o'zgarmaydi, ichida aylanadi.
export const HistoryList = styled.div`
    max-height: 320px;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-right: 4px;

    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background: ${colors.hairline};
        border-radius: 3px;
    }
`;

export const HistoryEmpty = styled.div`
    font-size: 12.5px;
    color: ${colors.textMuted};
    padding: 16px 4px;
    text-align: center;
`;

export const HistoryEntry = styled.div`
    background: ${colors.surfaceRaised};
    border: 1px solid ${colors.hairlineSoft};
    border-radius: 10px;
    padding: 10px 12px;
`;

export const HistoryEntryHead = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 6px;
`;

export const HistoryEntryDate = styled.span`
    font-family: ${font.mono};
    font-size: 11.5px;
    font-weight: 600;
    color: ${colors.textSecondary};
`;

export const HistoryEntryScores = styled.div`
    display: flex;
    gap: 6px;
    flex-shrink: 0;
`;

export const HistoryScorePill = styled.span`
    font-family: ${font.mono};
    font-size: 10px;
    font-weight: 700;
    color: ${(p) => p.$color};
    background: ${(p) => p.$bg};
    padding: 1px 6px;
    border-radius: 8px;
`;

export const HistoryDeleteBtn = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: ${colors.textMuted};
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s ease, color 0.15s ease;

    &:hover {
        background: ${colors.dangerSoft};
        color: ${colors.danger};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const HistoryEntryText = styled.p`
    font-size: 12.5px;
    color: ${colors.textPrimary};
    line-height: 1.55;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

export const HistoryEntryLabel = styled.span`
    font-size: 11px;
    font-weight: 600;
    color: ${colors.textMuted};
`;