import styled from "styled-components";
import { tokens } from "../../theme/tokens";

export const colors = {
    border: tokens.colors.hairline,
    borderSubtle: tokens.colors.hairlineSoft,
    primary: tokens.colors.amber,
    primaryLight: tokens.colors.amberSoft,
    accent: tokens.colors.amberStrong,
    text: tokens.colors.textPrimary,
    textMuted: tokens.colors.textSecondary,
    textSubtle: tokens.colors.textMuted,
    danger: tokens.colors.danger,
    dangerLight: tokens.colors.dangerSoft,
    hover: tokens.colors.surfaceRaised,
};

export const Shell = styled.div`
    display: flex;
    height: 100vh;
    background: ${tokens.colors.bg};
    overflow: hidden;
    font-family: ${tokens.font.body};
`;

export const Aside = styled.aside`
    width: 240px;
    min-width: 240px;
    background: ${tokens.colors.surface};
    border-right: 1px solid ${colors.border};
    display: flex;
    flex-direction: column;
    height: 100vh;
    position: sticky;
    top: 0;
    flex-shrink: 0;

    @media (max-width: 900px) {
        width: 72px;
        min-width: 72px;
    }
`;

export const LogoBlock = styled.div`
    padding: 24px 20px 20px;
    border-bottom: 1px solid ${colors.borderSubtle};

    @media (max-width: 900px) {
        padding: 20px 12px;
        display: flex;
        justify-content: center;
    }
`;

export const LogoRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const LogoIcon = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    span {
        color: ${tokens.colors.bg};
        font-size: 14px;
        font-weight: 700;
        font-family: ${tokens.font.mono};
    }
`;

export const LogoTextBlock = styled.div`
    @media (max-width: 900px) {
        display: none;
    }
`;

export const LogoTitle = styled.div`
    font-family: ${tokens.font.display};
    font-weight: 700;
    font-size: 15px;
    color: ${colors.text};
    letter-spacing: -0.01em;
`;

export const LogoSubtitle = styled.div`
    font-family: ${tokens.font.mono};
    font-size: 10px;
    letter-spacing: 0.04em;
    color: ${colors.textSubtle};
    margin-top: 2px;
`;

export const Nav = styled.nav`
    flex: 1;
    padding: 16px 12px;
    overflow-y: auto;
`;

export const NavSectionWrap = styled.div`
    margin-bottom: 24px;
`;

export const NavSectionLabel = styled.div`
    font-family: ${tokens.font.mono};
    font-size: 10px;
    font-weight: 600;
    color: ${colors.textSubtle};
    letter-spacing: 0.1em;
    padding: 0 12px;
    margin-bottom: 6px;

    @media (max-width: 900px) {
        display: none;
    }
`;

export const NavItem = styled(`button`)`
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 9px 12px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    text-align: left;
    margin-bottom: 2px;
    transition: background 0.15s, color 0.15s;
    background: ${(p) => (p.$active ? colors.primaryLight : "transparent")};
    color: ${(p) => (p.$active ? colors.primary : colors.textMuted)};
    font-family: inherit;
    font-size: 14px;
    font-weight: ${(p) => (p.$active ? 600 : 500)};
    text-decoration: none;

    &:hover {
        background: ${(p) => (p.$active ? colors.primaryLight : colors.hover)};
        color: ${(p) => (p.$active ? colors.primary : colors.text)};
    }

    svg {
        flex-shrink: 0;
    }

    span {
        @media (max-width: 900px) {
            display: none;
        }
    }
`;

export const BottomBlock = styled.div`
    padding: 12px;
    border-top: 1px solid ${colors.borderSubtle};
`;

export const UserRow = styled.button`
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 12px;
    border-radius: 10px;
    margin-bottom: 4px;
    cursor: pointer;
    border: none;
    background: transparent;
    font-family: inherit;
    text-align: left;
    transition: background 0.15s;

    &:hover {
        background: ${colors.hover};
    }
`;

export const UserAvatar = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    span {
        color: ${tokens.colors.bg};
        font-size: 13px;
        font-weight: 700;
    }
`;

export const UserInfo = styled.div`
    flex: 1;
    min-width: 0;

    @media (max-width: 900px) {
        display: none;
    }
`;

export const UserName = styled.div`
    font-size: 13px;
    font-weight: 600;
    color: ${colors.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const UserPlan = styled.div`
    font-family: ${tokens.font.mono};
    font-size: 10px;
    color: ${colors.textSubtle};
`;

export const BottomBtn = styled.button`
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 9px 12px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    text-align: left;
    background: transparent;
    color: ${(p) => (p.$danger ? colors.danger : colors.textMuted)};
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 2px;
    transition: background 0.15s;

    &:hover {
        background: ${(p) => (p.$danger ? colors.dangerLight : colors.hover)};
        color: ${(p) => (p.$danger ? colors.danger : colors.text)};
    }

    span {
        @media (max-width: 900px) {
            display: none;
        }
    }
`;

export const NotifPanel = styled.div`
    width: 320px;
    max-width: 82vw;
`;

export const NotifHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2px 2px 10px;
    border-bottom: 1px solid ${colors.borderSubtle};
    margin-bottom: 8px;
`;

export const NotifHeaderTitle = styled.div`
    font-family: ${tokens.font.display};
    font-weight: 700;
    font-size: 14px;
    color: ${colors.text};
`;

export const NotifMarkRead = styled.button`
    border: none;
    background: transparent;
    cursor: pointer;
    color: ${colors.primary};
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    padding: 0;

    &:disabled {
        color: ${colors.textSubtle};
        cursor: default;
    }
`;

export const NotifList = styled.div`
    max-height: 340px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

export const NotifItem = styled.div`
    display: flex;
    gap: 8px;
    align-items: flex-start;
    padding: 9px 8px;
    border-radius: 8px;
    background: ${(p) => (p.$read ? "transparent" : colors.primaryLight)};
`;

export const NotifDot = styled.span`
    width: 7px;
    height: 7px;
    border-radius: 50%;
    margin-top: 6px;
    flex-shrink: 0;
    background: ${(p) => (p.$read ? "transparent" : colors.primary)};
`;

export const NotifBody = styled.div`
    flex: 1;
    min-width: 0;
`;

export const NotifTitle = styled.div`
    font-size: 12.5px;
    font-weight: 600;
    color: ${colors.text};
    margin-bottom: 2px;
`;

export const NotifDesc = styled.div`
    font-size: 12px;
    color: ${colors.textMuted};
    line-height: 1.4;
`;

export const NotifTime = styled.div`
    font-family: ${tokens.font.mono};
    font-size: 10px;
    color: ${colors.textSubtle};
    margin-top: 3px;
`;

export const NotifEmpty = styled.div`
    padding: 24px 8px;
    text-align: center;
    color: ${colors.textSubtle};
    font-size: 12.5px;
`;

export const Main = styled.main`
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    height: 100vh;
    background: ${tokens.colors.bg};
`;
