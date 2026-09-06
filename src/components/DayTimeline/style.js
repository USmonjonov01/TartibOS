import styled from "styled-components";
import { tokens } from "../../theme/tokens";

const colors = {
    text: tokens.colors.textPrimary,
    textSubtle: tokens.colors.textSecondary,
    textMuted: tokens.colors.textMuted,
    border: tokens.colors.hairline,
    borderSubtle: tokens.colors.hairlineSoft,
    primary: tokens.colors.amber,
    primarySoft: tokens.colors.amberSoft,
    success: tokens.colors.success,
    danger: tokens.colors.danger,
    muted: tokens.colors.steelPast,
};

export const Card = styled.div`
    background: ${tokens.colors.surface};
    border: 1px solid ${colors.borderSubtle};
    border-radius: ${tokens.radius.md};
    padding: 16px 20px 14px;
    margin: 20px 0px;
`;

export const Head = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
`;

export const TitleBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
`;

export const Title = styled.h2`
    margin: 0;
    font-family: ${tokens.font.display};
    font-size: 14px;
    font-weight: 600;
    color: ${colors.text};
`;

/* "Hozir nima payti" — sarlavha ostida, alohida banner emas, oddiy matn */
export const NowCaption = styled.p`
    margin: 0;
    font-size: 12.5px;
    color: ${(p) => (p.$idle ? colors.textMuted : colors.primary)};
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const ClockBlock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-shrink: 0;
`;

export const ClockValue = styled.div`
    font-family: ${tokens.font.mono};
    font-size: 17px;
    font-weight: 700;
    color: ${colors.text};
    line-height: 1.2;
`;

export const ClockDate = styled.div`
    font-size: 10.5px;
    color: ${colors.textMuted};
    text-transform: capitalize;
`;

export const TrackWrap = styled.div`
    position: relative;
    margin-top: 18px;
`;

export const Track = styled.div`
    position: relative;
    height: 14px;
    border-radius: 999px;
    background: ${tokens.colors.surfaceRaised};
`;

export const Segment = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: ${(p) => p.$left}%;
    width: ${(p) => p.$width}%;
    min-width: 4px;
    border-radius: 999px;
    background: ${(p) => p.$color};
    opacity: ${(p) => (p.$isNow ? 1 : 0.55)};
    outline: ${(p) => (p.$isNow ? `2px solid ${p.$color}` : "none")};
    outline-offset: 2px;
    cursor: default;
    transition: opacity 0.15s ease;

    &:hover {
        opacity: 1;
    }
`;

export const NowMarker = styled.div`
    position: absolute;
    top: -5px;
    left: ${(p) => p.$left}%;
    width: 0;
    height: 0;
    transform: translateX(-50%);
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid ${colors.text};
    pointer-events: none;
`;

export const TickRow = styled.div`
    position: relative;
    height: 14px;
    margin-top: 4px;
`;

export const Tick = styled.span`
    position: absolute;
    left: ${(p) => p.$left}%;
    transform: translateX(${(p) => (p.$edge === "start" ? "0" : p.$edge === "end" ? "-100%" : "-50%")});
    font-family: ${tokens.font.mono};
    font-size: 10px;
    color: ${colors.textMuted};
    white-space: nowrap;
`;

export const LegendRow = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 12px;
    flex-wrap: wrap;
`;

export const LegendItem = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
    color: ${colors.textMuted};
`;

export const LegendDot = styled.span`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${(p) => p.$color};
    flex-shrink: 0;
`;

export const EmptyRow = styled.div`
    padding: 10px 0 2px;
    font-size: 12.5px;
    color: ${colors.textMuted};
`;

export { colors };
