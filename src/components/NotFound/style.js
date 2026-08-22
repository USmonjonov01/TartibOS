import styled, { keyframes } from "styled-components";
import { tokens } from "../../theme/tokens";

export const colors = tokens.colors;
export const font = tokens.font;

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
`;

const drift = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
`;

export const Wrapper = styled.div`
    min-height: 100vh;
    background: radial-gradient(ellipse 900px 500px at 50% -10%, ${colors.surfaceRaised} 0%, ${colors.bg} 55%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    font-family: ${font.body};
`;

export const Inner = styled.div`
    max-width: 480px;
    width: 100%;
    text-align: center;
    animation: ${fadeUp} 0.45s ease both;
`;

export const IllustrationWrap = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    animation: ${drift} 4.5s ease-in-out infinite;
`;

export const Eyebrow = styled.div`
    font-family: ${font.mono};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: ${colors.amber};
    text-transform: uppercase;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    &::before,
    &::after {
        content: "";
        width: 16px;
        height: 1px;
        background: ${colors.amber};
        opacity: 0.6;
    }
`;

export const CodeNumber = styled.div`
    font-family: ${font.mono};
    font-size: 72px;
    font-weight: 700;
    line-height: 1;
    color: ${colors.textPrimary};
    letter-spacing: -0.02em;
    margin-bottom: 12px;

    span {
        color: ${colors.amber};
    }

    @media (max-width: 480px) {
        font-size: 56px;
    }
`;

export const Title = styled.h1`
    font-family: ${font.display};
    font-size: 22px;
    font-weight: 700;
    color: ${colors.textPrimary};
    margin: 0 0 10px;
    letter-spacing: -0.02em;
`;

export const Subtitle = styled.p`
    font-size: 14px;
    color: ${colors.textSecondary};
    line-height: 1.7;
    margin: 0 0 32px;
`;

export const PathTag = styled.code`
    font-family: ${font.mono};
    font-size: 12px;
    color: ${colors.textMuted};
    background: ${colors.surfaceRaised};
    border: 1px solid ${colors.hairline};
    border-radius: 6px;
    padding: 2px 8px;
`;

export const ActionsRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
`;

export const PrimaryButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: ${colors.amber};
    color: ${colors.bg};
    border: none;
    border-radius: 9px;
    font-size: 14.5px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    text-decoration: none;
    transition: background 0.15s, transform 0.1s;

    &:hover {
        background: ${colors.amberStrong};
        transform: translateY(-1px);
    }
`;

export const SecondaryButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: transparent;
    color: ${colors.textMuted};
    border: 1px solid ${colors.hairline};
    border-radius: 9px;
    font-size: 14px;
    cursor: pointer;
    font-family: inherit;
    text-decoration: none;
    transition: all 0.15s;

    &:hover {
        border-color: ${colors.textMuted};
        color: ${colors.textSecondary};
    }
`;