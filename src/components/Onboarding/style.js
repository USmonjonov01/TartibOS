import styled from "styled-components";
import { tokens } from "../../theme/tokens";

const { colors } = tokens;

export const Page = styled.div`
    min-height: 100vh;
    background: ${colors.bg};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    box-sizing: border-box;
`;

export const Welcome = styled.div`
    width: 100%;
    max-width: 620px;
    margin-bottom: 18px;
    text-align: left;
`;

export const WelcomeEyebrow = styled.div`
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${colors.amber};
    margin-bottom: 6px;
`;

export const WelcomeText = styled.div`
    font-size: 14px;
    line-height: 1.6;
    color: ${colors.textSecondary};
`;

export const Card = styled.div`
    width: 100%;
    max-width: 620px;
    padding: 30px 28px 26px;
    box-sizing: border-box;
    border-radius: ${tokens.radius.lg};
    border: 1px solid ${colors.hairline};
    background: ${colors.surface};
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);

    @media (max-width: 480px) {
        padding: 22px 18px 20px;
    }
`;
