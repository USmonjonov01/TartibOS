import styled, { keyframes } from "styled-components";
import { tokens } from "../../theme/tokens";

const fillLoop = keyframes`
    100% { inset: 0; }
`;

export const LoaderWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 48px 0;
`;

export const Pill = styled.div`
    width: 140px;
    height: 22px;
    border-radius: 20px;
    color: ${tokens.colors.amber};
    border: 2px solid;
    position: relative;
    overflow: hidden;
`;

/* Holat noma'lum bo'lganda (bitta so'rov, davomiyligi taxmin qilib bo'lmaydi) —
   asl snippetdagi kabi cheksiz aylanuvchi to'ldirish animatsiyasi */
export const IndeterminateFill = styled.div`
    position: absolute;
    margin: 2px;
    inset: 0 100% 0 0;
    border-radius: inherit;
    background: currentColor;
    animation: ${fillLoop} 1.6s infinite;
`;

/* Holat ma'lum bo'lganda (masalan N ta so'rovdan nechtasi tugadi) —
   haqiqiy foizga qarab kengayadi, soxta animatsiya emas */
export const DeterminateFill = styled.div`
    position: absolute;
    margin: 2px;
    inset: 0 auto 0 0;
    width: ${(p) => Math.max(0, Math.min(100, p.$pct))}%;
    border-radius: inherit;
    background: currentColor;
    transition: width 0.35s ease;
`;

export const LoaderLabel = styled.div`
    font-family: ${tokens.font.mono};
    font-size: 12px;
    color: ${tokens.colors.textMuted};
    letter-spacing: 0.02em;
`;
