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
    max-width: 720px;
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

export const SuccessBanner = styled.div`
    background: ${colors.successSoft};
    color: #8fd6b3;
    border: 1px solid rgba(58, 168, 114, 0.35);
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 13px;
    margin-bottom: 20px;
`;

/* ---------- Identity card ---------- */

export const IdentityCard = styled.div`
    background: linear-gradient(160deg, ${colors.surfaceRaised} 0%, ${colors.surface} 100%);
    border: 1px solid ${colors.hairline};
    border-radius: ${tokens.radius.lg};
    padding: 26px 28px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 18px;
    position: relative;
    overflow: hidden;
    animation: ${fadeUp} 0.4s ease 0.05s both;

    &::after {
        content: "";
        position: absolute;
        top: -60px;
        right: -60px;
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, ${colors.amberSoft} 0%, transparent 70%);
        pointer-events: none;
    }

    @media (max-width: 480px) {
        flex-direction: column;
        text-align: center;
    }
`;

export const AvatarCircle = styled.div`
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: ${colors.amberSoft};
    color: ${colors.amber};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${font.display};
    font-size: 24px;
    font-weight: 700;
    flex-shrink: 0;
    border: 1px solid rgba(231, 169, 76, 0.35);
`;

export const IdentityBody = styled.div`
    min-width: 0;
`;

export const UserName = styled.div`
    font-family: ${font.display};
    font-size: 19px;
    font-weight: 700;
    color: ${colors.textPrimary};
    margin-bottom: 4px;
    overflow-wrap: anywhere;
`;

export const UserEmail = styled.div`
    font-size: 13px;
    color: ${colors.textSecondary};
    margin-bottom: 6px;
    overflow-wrap: anywhere;
`;

export const UserSince = styled.div`
    font-family: ${font.mono};
    font-size: 11.5px;
    color: ${colors.textMuted};
`;

/* ---------- Journey stats ---------- */

export const StatGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 20px;

    @media (max-width: 520px) {
        grid-template-columns: 1fr;
    }
`;

export const StatCard = styled.div`
    background: ${colors.surface};
    border: 1px solid ${colors.hairline};
    border-radius: ${tokens.radius.md};
    padding: 14px 16px;
    animation: ${fadeUp} 0.4s ease both;
`;

export const StatLabel = styled.div`
    font-family: ${font.mono};
    font-size: 10px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${colors.textMuted};
    margin-bottom: 8px;
`;

export const StatValue = styled.div`
    font-family: ${font.mono};
    font-size: 22px;
    font-weight: 700;
    color: ${colors.textPrimary};
`;

/* ---------- Sections (Statistics'dagi SectionCard bilan bir xil) ---------- */

export const SectionCard = styled.div`
    background: ${colors.surface};
    border: 1px solid ${colors.hairline};
    border-radius: ${tokens.radius.lg};
    padding: 24px 26px;
    margin-bottom: 20px;
    animation: ${fadeUp} 0.4s ease both;

    @media (max-width: 640px) {
        padding: 20px;
    }
`;

export const SectionHead = styled.div`
    margin-bottom: 20px;
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

/* ---------- Form ---------- */

export const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 16px;

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

export const Field = styled.div``;

export const FieldLabel = styled.label`
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: ${colors.textSecondary};
    margin-bottom: 6px;
`;

export const Input = styled.input`
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 14px;
    color: ${colors.textPrimary};
    font-family: inherit;
    outline: none;
    background: ${colors.surfaceRaised};
    border: 1px solid ${colors.hairline};
    box-sizing: border-box;
    transition: border-color 0.15s;

    &::placeholder {
        color: ${colors.textMuted};
    }

    &:focus {
        border-color: ${colors.amber};
    }
`;

export const FieldError = styled.div`
    font-size: 12px;
    color: ${colors.danger};
    margin-top: 4px;
`;

export const SaveBtn = styled.button`
    padding: 10px 22px;
    background: ${colors.amber};
    color: ${colors.bg};
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.15s;
    opacity: ${(p) => (p.$disabled ? 0.6 : 1)};
`;

/* ---------- Danger zone ---------- */

export const DangerZone = styled.div`
    background: ${colors.dangerSoft};
    border: 1px solid rgba(200, 92, 78, 0.3);
    border-radius: ${tokens.radius.lg};
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
`;

export const DangerText = styled.div`
    font-size: 13px;
    color: #f0a99e;
    max-width: 380px;
    line-height: 1.6;
`;

export const LogoutBtn = styled.button`
    padding: 10px 20px;
    background: transparent;
    color: ${colors.danger};
    border: 1px solid rgba(200, 92, 78, 0.5);
    border-radius: 8px;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    transition: all 0.15s;

    &:hover {
        background: rgba(200, 92, 78, 0.12);
    }
`;