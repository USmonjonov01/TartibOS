import styled from "styled-components";
import { tokens } from "../../../theme/tokens";

export const colors = tokens.colors;
export const font = tokens.font;

export const Wrapper = styled.div`
    min-height: 100vh;
    background: radial-gradient(ellipse 900px 500px at 15% -10%, ${colors.surfaceRaised} 0%, ${colors.bg} 55%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    font-family: ${font.body};
`;

export const Card = styled.div`
    width: 100%;
    max-width: 400px;
    background: ${colors.surface};
    border-radius: ${tokens.radius.lg};
    border: 1px solid ${colors.hairline};
    padding: 40px 36px;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);

    @media (max-width: 480px) {
        padding: 32px 24px;
    }
`;

export const Header = styled.div`
    text-align: center;
    margin-bottom: 32px;
`;

export const LogoRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 24px;
`;

export const LogoIcon = styled.div`
    width: 36px;
    height: 36px;
    border-radius: ${tokens.radius.sm};
    background: linear-gradient(135deg, ${colors.amber} 0%, ${colors.amberStrong} 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    span {
        color: ${colors.bg};
        font-size: 16px;
        font-weight: 700;
        font-family: ${font.mono};
    }
`;

export const LogoText = styled.span`
    font-family: ${font.display};
    font-size: 18px;
    font-weight: 700;
    color: ${colors.textPrimary};
    letter-spacing: -0.02em;
`;

export const Title = styled.h1`
    font-family: ${font.display};
    font-size: 24px;
    font-weight: 700;
    color: ${colors.textPrimary};
    letter-spacing: -0.02em;
    margin-bottom: 6px;
`;

export const Subtitle = styled.p`
    font-size: 14px;
    color: ${colors.textSecondary};
    margin: 0;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 14px;
`;

export const Field = styled.div``;

export const Label = styled.label`
    display: block;
    font-family: ${font.mono};
    font-size: 11px;
    font-weight: 600;
    color: ${colors.textMuted};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 6px;
`;

export const InputWrap = styled.div`
    position: relative;
`;

export const Input = styled.input`
    width: 100%;
    padding: 11px 14px;
    padding-right: ${(p) => (p.$hasIcon ? "42px" : "14px")};
    border: 1px solid ${(p) => (p.$error ? colors.danger : colors.hairline)};
    border-radius: ${tokens.radius.sm};
    font-size: 14px;
    color: ${colors.textPrimary};
    font-family: inherit;
    outline: none;
    background: ${colors.surfaceRaised};
    box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;

    &:focus {
        border-color: ${(p) => (p.$error ? colors.danger : colors.amber)};
        box-shadow: 0 0 0 3px ${(p) => (p.$error ? colors.dangerSoft : colors.amberSoft)};
    }

    &::placeholder {
        color: ${colors.textMuted};
        opacity: 0.7;
    }
`;

export const ToggleVisibility = styled.button`
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    padding: 0;
    color: ${colors.textMuted};

    &:hover {
        color: ${colors.textSecondary};
    }
`;

export const ErrorText = styled.p`
    font-size: 12px;
    color: ${colors.danger};
    margin: 6px 0 0;
`;

export const ErrorBanner = styled.div`
    background: ${colors.dangerSoft};
    color: #f0a99e;
    border: 1px solid rgba(200, 92, 78, 0.3);
    border-radius: ${tokens.radius.sm};
    padding: 10px 12px;
    font-size: 13px;
    margin-bottom: 4px;
`;

export const SubmitButton = styled.button`
    width: 100%;
    padding: 12px;
    background: ${colors.amber};
    color: ${colors.bg};
    border: none;
    border-radius: ${tokens.radius.sm};
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    margin-top: 4px;
    letter-spacing: -0.01em;
    transition: background 0.15s, opacity 0.15s, transform 0.1s;

    &:hover:not(:disabled) {
        background: ${colors.amberStrong};
        transform: translateY(-1px);
    }

    &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
        transform: none;
    }
`;

export const FooterText = styled.p`
    text-align: center;
    font-size: 14px;
    color: ${colors.textSecondary};
    margin-top: 20px;
`;

export const LinkButton = styled.button`
    background: none;
    border: none;
    color: ${colors.amber};
    font-weight: 600;
    cursor: pointer;
    font-size: 14px;
    font-family: inherit;
    padding: 0;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

export const BackText = styled.p`
    text-align: center;
    margin-top: 4px;
`;

export const BackButton = styled.button`
    background: none;
    border: none;
    color: ${colors.textMuted};
    cursor: pointer;
    font-size: 13px;
    font-family: inherit;
    padding: 0;
    text-decoration: none;

    &:hover {
        color: ${colors.textSecondary};
    }
`;