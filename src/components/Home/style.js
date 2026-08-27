import styled from "styled-components";
import { tokens } from "../../theme/tokens";

export const colors = {
    bg: tokens.colors.bg,
    surface: tokens.colors.surface,
    border: tokens.colors.hairline,
    borderSubtle: tokens.colors.hairlineSoft,
    primary: tokens.colors.amber,
    primaryLight: tokens.colors.amberSoft,
    primaryHover: tokens.colors.amberStrong,
    accent: tokens.colors.steelPast,
    accentLight: tokens.colors.steelPastSoft,
    success: tokens.colors.success,
    successLight: tokens.colors.successSoft,
    warning: tokens.colors.amber,
    warningLight: tokens.colors.amberSoft,
    text: tokens.colors.textPrimary,
    textMuted: tokens.colors.textSecondary,
    textSubtle: tokens.colors.textMuted,
};

/* ---------- Layout ---------- */

export const Wrapper = styled.div`
    min-height: 100vh;
    background: radial-gradient(ellipse 1000px 600px at 50% -10%, ${tokens.colors.surfaceRaised} 0%, ${colors.bg} 55%);
    font-family: ${tokens.font.body};
`;

/* ---------- Nav ---------- */

export const Nav = styled.nav`
    position: sticky;
    top: 0;
    background: rgba(14, 20, 32, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid ${colors.border};
    z-index: 100;
`;

export const NavInner = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 640px) {
        padding: 0 16px;
    }
`;

export const LogoBox = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const LogoIcon = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 7px;
    background: linear-gradient(135deg, ${tokens.colors.amberStrong} 0%, ${colors.primary} 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    span {
        color: ${colors.bg};
        font-size: 13px;
        font-weight: 700;
        font-family: ${tokens.font.mono};
    }
`;

export const LogoText = styled.span`
    font-family: ${tokens.font.display};
    font-weight: 700;
    font-size: 16px;
    color: ${colors.text};
    letter-spacing: -0.01em;

    @media (max-width: 400px) {
        display: none;
    }
`;

export const NavActions = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

/* ---------- Buttons ---------- */

export const BtnGhost = styled.button`
    padding: 8px 18px;
    background: transparent;
    color: ${colors.textMuted};
    border: 1px solid ${colors.border};
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s, border-color 0.15s;

    &:hover {
        background: ${tokens.colors.surfaceRaised};
        border-color: ${tokens.colors.steelPast};
        color: ${colors.text};
    }

    @media (max-width: 400px) {
        padding: 8px 12px;
        font-size: 13px;
    }
`;

export const BtnPrimary = styled.button`
    padding: 8px 18px;
    background: ${colors.primary};
    color: ${colors.bg};
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s;

    &:hover {
        background: ${colors.primaryHover};
    }

    @media (max-width: 400px) {
        padding: 8px 12px;
        font-size: 13px;
    }
`;

export const BtnPrimaryLg = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: ${colors.primary};
    color: ${colors.bg};
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s;

    &:hover {
        background: ${colors.primaryHover};
    }
`;

export const BtnSecondaryLg = styled.button`
    padding: 14px 28px;
    background: ${tokens.colors.surface};
    color: ${colors.text};
    border: 1px solid ${colors.border};
    border-radius: 10px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s;

    &:hover {
        background: ${tokens.colors.surfaceRaised};
    }
`;

export const BtnCta = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 32px;
    background: ${colors.bg};
    color: ${colors.primary};
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: transform 0.15s;

    &:hover {
        transform: scale(1.02);
    }
`;

/* ---------- Hero ---------- */

export const HeroSection = styled.section`
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 40px 0;

    @media (max-width: 768px) {
        padding: 48px 20px 0;
    }
`;

export const HeroInner = styled.div`
    max-width: 760px;
    margin: 0 auto 60px;
    text-align: center;

    @media (max-width: 768px) {
        margin-bottom: 40px;
    }
`;

export const Badge = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: ${colors.primaryLight};
    color: ${colors.primary};
    padding: 6px 14px;
    border-radius: 20px;
    font-family: ${tokens.font.mono};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.03em;
    margin-bottom: 24px;
    border: 1px solid rgba(231, 169, 76, 0.3);
`;

export const BadgeDot = styled.div`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${colors.primary};
`;

export const HeroTitle = styled.h1`
    font-family: ${tokens.font.display};
    font-size: clamp(32px, 6vw, 52px);
    font-weight: 700;
    color: ${colors.text};
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin-bottom: 20px;
`;

export const GradientSpan = styled.span`
    background: linear-gradient(135deg, ${tokens.colors.amberStrong} 0%, ${colors.primary} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
`;

export const HeroDesc = styled.p`
    font-size: 18px;
    color: ${colors.textMuted};
    line-height: 1.7;
    margin: 0 auto 36px;
    max-width: 560px;

    @media (max-width: 480px) {
        font-size: 16px;
    }
`;

export const HeroActions = styled.div`
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
`;

/* ---------- App preview ---------- */

export const PreviewCard = styled.div`
    background: ${tokens.colors.surface};
    border-radius: 16px;
    border: 1px solid ${colors.border};
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
    overflow: hidden;
    max-width: 960px;
    margin: 0 auto;
`;

export const PreviewBar = styled.div`
    background: ${tokens.colors.surfaceRaised};
    border-bottom: 1px solid ${colors.border};
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 6px;
`;

export const PreviewDot = styled.div`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${(p) => p.$color};
    flex-shrink: 0;
`;

export const PreviewUrl = styled.div`
    flex: 1;
    background: ${colors.bg};
    border-radius: 6px;
    height: 26px;
    margin: 0 16px;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
        font-family: ${tokens.font.mono};
        font-size: 11px;
        color: ${colors.textSubtle};
    }

    @media (max-width: 480px) {
        margin: 0 8px;
    }
`;

export const PreviewBody = styled.div`
    display: flex;
    height: 380px;

    @media (max-width: 640px) {
        height: auto;
    }
`;

export const MiniSidebar = styled.div`
    width: 180px;
    border-right: 1px solid ${colors.borderSubtle};
    padding: 16px 12px;
    background: ${tokens.colors.surface};
    flex-shrink: 0;

    @media (max-width: 640px) {
        display: none;
    }
`;

export const MiniLogoRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    padding-left: 8px;
`;

export const MiniLogoIcon = styled.div`
    width: 22px;
    height: 22px;
    border-radius: 5px;
    background: linear-gradient(135deg, ${tokens.colors.amberStrong}, ${colors.primary});
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    span {
        color: ${colors.bg};
        font-size: 10px;
        font-weight: 700;
    }
`;

export const MiniLogoText = styled.span`
    font-size: 12px;
    font-weight: 700;
    color: ${colors.text};
`;

export const MiniNavItem = styled.div`
    padding: 7px 10px;
    border-radius: 6px;
    background: ${(p) => (p.$active ? colors.primaryLight : "transparent")};
    color: ${(p) => (p.$active ? colors.primary : colors.textMuted)};
    font-size: 12px;
    font-weight: ${(p) => (p.$active ? 600 : 500)};
    margin-bottom: 2px;
`;

export const MiniContent = styled.div`
    flex: 1;
    padding: 20px 24px;
    overflow: hidden;
    min-width: 0;

    @media (max-width: 480px) {
        padding: 16px;
    }
`;

export const MiniDate = styled.div`
    font-family: ${tokens.font.mono};
    font-size: 11px;
    color: ${colors.textSubtle};
    margin-bottom: 2px;
`;

export const MiniGreeting = styled.div`
    font-size: 16px;
    font-weight: 700;
    color: ${colors.text};
    margin-bottom: 16px;
`;

export const MiniStatsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 14px;
`;

export const MiniStatCard = styled.div`
    background: ${colors.bg};
    border-radius: 8px;
    padding: 10px 12px;
    border: 1px solid ${colors.borderSubtle};
`;

export const MiniStatLabel = styled.div`
    font-size: 10px;
    color: ${colors.textSubtle};
    margin-bottom: 3px;
`;

export const MiniStatValue = styled.div`
    font-size: 18px;
    font-weight: 700;
    color: ${colors.text};
    font-family: ${tokens.font.mono};
`;

export const MiniHabitsCard = styled.div`
    background: ${colors.bg};
    border-radius: 8px;
    padding: 12px;
    border: 1px solid ${colors.borderSubtle};
`;

export const MiniHabitsTitle = styled.div`
    font-size: 11px;
    font-weight: 600;
    color: ${colors.text};
    margin-bottom: 8px;
`;

export const MiniHabitRow = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;

    &:last-child {
        margin-bottom: 0;
    }
`;

export const MiniHabitDot = styled.div`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid ${(p) => (p.$done ? colors.success : tokens.colors.steelPast)};
    background: ${(p) => (p.$done ? colors.success : "transparent")};
    flex-shrink: 0;
`;

export const MiniHabitName = styled.span`
    font-size: 11px;
    color: ${(p) => (p.$done ? colors.textSubtle : colors.text)};
    text-decoration: ${(p) => (p.$done ? "line-through" : "none")};
`;

/* ---------- Features ---------- */

export const FeaturesSection = styled.section`
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 40px;

    @media (max-width: 768px) {
        padding: 56px 20px;
    }
`;

export const FeaturesHeader = styled.div`
    text-align: center;
    margin-bottom: 48px;
`;

export const FeaturesTitle = styled.h2`
    font-family: ${tokens.font.display};
    font-size: clamp(24px, 4vw, 34px);
    font-weight: 700;
    color: ${colors.text};
    letter-spacing: -0.02em;
    margin-bottom: 12px;
`;

export const FeaturesDesc = styled.p`
    font-size: 16px;
    color: ${colors.textMuted};
    max-width: 480px;
    margin: 0 auto;
`;

export const FeaturesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`;

export const FeatureCard = styled.div`
    background: ${tokens.colors.surface};
    border: 1px solid ${colors.border};
    border-radius: 14px;
    padding: 24px;
    transition: border-color 0.2s, transform 0.2s;
    cursor: default;

    &:hover {
        border-color: ${tokens.colors.steelPast};
        transform: translateY(-2px);
    }
`;

export const FeatureIconBox = styled.div`
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: ${(p) => p.$bg};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
`;

export const FeatureTitle = styled.h3`
    font-size: 16px;
    font-weight: 700;
    color: ${colors.text};
    margin-bottom: 8px;
`;

export const FeatureDesc = styled.p`
    font-size: 14px;
    color: ${colors.textMuted};
    line-height: 1.6;
    margin: 0;
`;

/* ---------- CTA ---------- */

export const CTASection = styled.section`
    padding: 0 40px 80px;
    max-width: 1200px;
    margin: 0 auto;

    @media (max-width: 768px) {
        padding: 0 20px 56px;
    }
`;

export const CTABox = styled.div`
    background: linear-gradient(135deg, ${tokens.colors.amberStrong} 0%, ${colors.primary} 100%);
    border-radius: 20px;
    padding: 60px 48px;
    text-align: center;

    @media (max-width: 640px) {
        padding: 40px 24px;
    }
`;

export const CTATitle = styled.h2`
    font-family: ${tokens.font.display};
    font-size: clamp(24px, 4vw, 34px);
    font-weight: 700;
    color: ${colors.bg};
    letter-spacing: -0.02em;
    margin-bottom: 14px;
`;

export const CTADesc = styled.p`
    font-size: 16px;
    color: rgba(14, 20, 32, 0.75);
    margin: 0 auto 32px;
    max-width: 460px;
`;

/* ---------- Footer ---------- */

export const Footer = styled.footer`
    border-top: 1px solid ${colors.border};
    padding: 24px 40px;
    text-align: center;

    span {
        font-family: ${tokens.font.mono};
        font-size: 12px;
        color: ${colors.textSubtle};
    }
`;

/* ---------- How it works (steps) ---------- */

export const StepsSection = styled.section`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px 80px;

    @media (max-width: 768px) {
        padding: 0 20px 56px;
    }
`;

export const StepsHeader = styled.div`
    text-align: center;
    margin-bottom: 48px;
`;

export const StepsEyebrow = styled.div`
    font-family: ${tokens.font.mono};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: ${colors.primary};
    text-transform: uppercase;
    margin-bottom: 10px;
`;

export const StepsTitle = styled.h2`
    font-family: ${tokens.font.display};
    font-size: clamp(24px, 4vw, 34px);
    font-weight: 700;
    color: ${colors.text};
    letter-spacing: -0.02em;
    margin: 0;
`;

export const StepsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    position: relative;

    @media (max-width: 760px) {
        grid-template-columns: 1fr;
        gap: 32px;
    }
`;

export const StepCard = styled.div`
    text-align: center;
    position: relative;
`;

export const StepNumber = styled.div`
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: ${colors.primaryLight};
    border: 1px solid rgba(231, 169, 76, 0.35);
    color: ${colors.primary};
    font-family: ${tokens.font.mono};
    font-size: 18px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 18px;
`;

export const StepTitle = styled.h3`
    font-size: 16px;
    font-weight: 700;
    color: ${colors.text};
    margin: 0 0 8px;
`;

export const StepDesc = styled.p`
    font-size: 14px;
    color: ${colors.textMuted};
    line-height: 1.6;
    margin: 0;
    max-width: 280px;
    margin: 0 auto;
`;

/* ---------- FAQ ---------- */

export const FAQSection = styled.section`
    max-width: 760px;
    margin: 0 auto;
    padding: 0 40px 80px;

    @media (max-width: 768px) {
        padding: 0 20px 56px;
    }
`;

export const FAQHeader = styled.div`
    text-align: center;
    margin-bottom: 40px;
`;

export const FAQTitle = styled.h2`
    font-family: ${tokens.font.display};
    font-size: clamp(24px, 4vw, 34px);
    font-weight: 700;
    color: ${colors.text};
    letter-spacing: -0.02em;
    margin: 0;
`;

export const FAQList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const FAQItem = styled.div`
    background: ${tokens.colors.surface};
    border: 1px solid ${colors.border};
    border-radius: 14px;
    overflow: hidden;
    transition: border-color 0.15s;

    &:hover {
        border-color: ${tokens.colors.steelPast};
    }
`;

export const FAQQuestion = styled.button`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 22px;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    font-size: 15px;
    font-weight: 600;
    color: ${colors.text};

    svg {
        flex-shrink: 0;
        color: ${colors.textSubtle};
        transition: transform 0.2s;
        transform: ${(p) => (p.$open ? "rotate(180deg)" : "rotate(0deg)")};
    }
`;

export const FAQAnswer = styled.div`
    max-height: ${(p) => (p.$open ? "200px" : "0")};
    overflow: hidden;
    transition: max-height 0.25s ease;
`;

export const FAQAnswerInner = styled.p`
    padding: 0 22px 18px;
    margin: 0;
    font-size: 14px;
    color: ${colors.textMuted};
    line-height: 1.65;
`;
