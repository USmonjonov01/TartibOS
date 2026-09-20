import styled from "styled-components";
import { tokens } from "../../../theme/tokens";

const colors = tokens.colors;
const font = tokens.font;

export const SidePane = styled.div`
    flex: 1.05;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 48px 40px 48px 64px;
    background: linear-gradient(160deg, ${colors.surface} 0%, ${colors.bg} 100%);
    border-left: 1px solid ${colors.hairline};
    position: relative;
    overflow: hidden;

    @media (max-width: 1080px) {
        display: none;
    }
`;

export const SideGlow = styled.div`
    position: absolute;
    top: -160px;
    right: -120px;
    width: 520px;
    height: 480px;
    border-radius: 50%;
    background: radial-gradient(circle, ${colors.amberSoft} 0%, transparent 70%);
    pointer-events: none;
`;

export const SideContent = styled.div`
    max-width: 450px;
    position: relative;
`;

/* --- "Mini-dashboard" makoni: statistika ko'rinishidagi rasm --- */

export const DashWrap = styled.div`
    margin-bottom: 32px;
`;

export const DashCard = styled.div`
    position: relative;
    background: ${colors.surface};
    border: 1px solid ${colors.hairline};
    border-radius: 20px;
    padding: 22px 22px 20px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
    width: 100%;
    max-width: 480px;
`;

export const DashStreakChip = styled.div`
    position: absolute;
    top: -14px;
    right: 20px;
    background: ${colors.amber};
    color: ${colors.bg};
    font-size: 12px;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 20px;
    box-shadow: 0 8px 20px ${colors.amberSoft};
    display: flex;
    align-items: center;
    gap: 5px;
`;

export const DashHeaderRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
`;

export const DashHeaderLabel = styled.div`
    font-family: ${font.mono};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${colors.textMuted};
`;

export const DashHeaderStat = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: 700;
    color: ${colors.success};

    svg {
        flex-shrink: 0;
    }
`;

export const DashBars = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 7px;
    height: 84px;
    margin-bottom: 20px;
`;

export const DashBar = styled.div`
    flex: 1;
    height: ${(p) => p.$h}%;
    border-radius: 5px 5px 2px 2px;
    background: ${(p) => (p.$hi ? `linear-gradient(180deg, ${colors.amberStrong} 0%, ${colors.amber} 100%)` : colors.surfaceRaised)};
    border: 1px solid ${(p) => (p.$hi ? "transparent" : colors.hairline)};
`;

export const DashDivider = styled.div`
    height: 1px;
    background: ${colors.hairline};
    margin-bottom: 18px;
`;

export const DashProgressRow = styled.div`
    margin-bottom: 13px;

    &:last-child {
        margin-bottom: 0;
    }
`;

export const DashProgressLabelRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12.5px;
    color: ${colors.textSecondary};
    margin-bottom: 6px;

    strong {
        color: ${colors.textPrimary};
        font-weight: 700;
    }
`;

export const DashProgressTrack = styled.div`
    height: 6px;
    border-radius: 4px;
    background: ${colors.hairlineSoft};
    overflow: hidden;
`;

export const DashProgressFill = styled.div`
    height: 100%;
    border-radius: 4px;
    width: ${(p) => p.$pct}%;
    background: linear-gradient(90deg, ${colors.amberStrong} 0%, ${colors.amber} 100%);
`;

/* --- Matn qismi --- */

export const SideTitle = styled.h2`
    font-family: ${font.display};
    font-size: 26px;
    font-weight: 700;
    color: ${colors.textPrimary};
    letter-spacing: -0.02em;
    margin: 0 0 12px;
    line-height: 1.25;
`;

export const SideDesc = styled.p`
    font-size: 14.5px;
    color: ${colors.textSecondary};
    line-height: 1.65;
    margin: 0 0 26px;
`;

export const SideFeatureList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 13px;
`;

export const SideFeatureItem = styled.li`
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 13.5px;
    color: ${colors.textSecondary};
    line-height: 1.5;

    svg {
        flex-shrink: 0;
        margin-top: 2px;
        color: ${colors.amber};
    }
`;
