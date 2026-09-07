import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Badge, Popover } from "antd";
import {
    LayoutDashboard,
    Target,
    RefreshCw,
    BarChart2,
    FileText,
    CalendarClock,
    Settings,
    LogOut,
    ChevronRight,
    Bell,
    Menu,
    Sun,
    Moon,
} from "lucide-react";
import { useUser } from "../../context/users";
import { useTheme } from "../../context/theme";
import { useNotifications } from "../../context/notifications";
import { Shell, Aside, Overlay, MobileTopBar, HamburgerBtn, MobileTopBarTitle, LogoBlock, LogoRow, LogoIcon, LogoTextBlock, LogoTitle, LogoSubtitle, Nav, NavSectionWrap, NavSectionLabel, NavItem, BottomBlock, UserRow, UserAvatar, UserInfo, UserName, UserPlan, BottomBtn, Main, colors, NotifPanel, NotifHeader, NotifHeaderTitle, NotifMarkRead, NotifList, NotifItem, NotifDot, NotifBody, NotifTitle, NotifDesc, NotifTime, NotifEmpty, } from "./style";
import TartibOSLogo from "../../assets/icons/TartibOS1.png"
const homeNav = [
    { path: "/dashboard", label: "Bosh sahifa", icon: LayoutDashboard },
];

const planNav = [
    { path: "/missions", label: "Vazifalarim", icon: Target },
    { path: "/routine", label: "Kun tartibim", icon: RefreshCw },
];

const progressNav = [
    { path: "/statistics", label: "Taraqqiyot", icon: BarChart2 },
    { path: "/history", label: "Tarix", icon: CalendarClock },
    { path: "/review", label: "Sharh", icon: FileText },
];

const formatNotifTime = (iso) =>
    new Date(iso).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useUser();
    const { theme, toggleTheme } = useTheme();
    const { history, unreadCount, markAllRead } = useNotifications();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (path) => location.pathname.startsWith(path);

    // Foydalanuvchi biror sahifaga o'tganda mobil drawer avtomatik yopiladi —
    // aks holda ochiq holicha qolib, keyingi sahifa ustida turib qolar edi.
    const handleNavigate = (path) => {
        navigate(path);
        setMobileOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate("/sign-in");
    };

    const initial = user?.ism?.trim()?.charAt(0)?.toUpperCase() || "?";

    const notifPanel = (
        <NotifPanel>
            <NotifHeader>
                <NotifHeaderTitle>Bildirishnomalar</NotifHeaderTitle>
                <NotifMarkRead onClick={markAllRead} disabled={unreadCount === 0}>
                    Hammasini o'qildi deb belgilash
                </NotifMarkRead>
            </NotifHeader>
            {history.length === 0 ? (
                <NotifEmpty>Hozircha bildirishnoma yo'q</NotifEmpty>
            ) : (
                <NotifList>
                    {history.map((n) => (
                        <NotifItem key={n.id} $read={n.read}>
                            <NotifDot $read={n.read} />
                            <NotifBody>
                                <NotifTitle>{n.title}</NotifTitle>
                                {n.description && <NotifDesc>{n.description}</NotifDesc>}
                                <NotifTime>{formatNotifTime(n.time)}</NotifTime>
                            </NotifBody>
                        </NotifItem>
                    ))}
                </NotifList>
            )}
        </NotifPanel>
    );

    return (
        <Shell>
            {mobileOpen && <Overlay onClick={() => setMobileOpen(false)} />}

            <Aside $open={mobileOpen}>
                <LogoBlock>
                    <LogoRow>
                        <LogoIcon>
                            <img width="100%" style={{ overflow: "hidden", borderRadius: "8px" }} src={TartibOSLogo} alt="TartibOS" />
                        </LogoIcon>
                        <LogoTextBlock>
                            <LogoTitle>TartibOS</LogoTitle>
                            <LogoSubtitle>Shaxsiy tizim</LogoSubtitle>
                        </LogoTextBlock>
                    </LogoRow>
                </LogoBlock>

                <Nav>
                    <NavSectionWrap>
                        {homeNav.map(({ path, label, icon: Icon }) => (
                            <NavItem
                                key={path}
                                type="button"
                                $active={isActive(path)}
                                onClick={() => handleNavigate(path)}
                            >
                                <Icon size={16} strokeWidth={isActive(path) ? 2.5 : 2} />
                                <span>{label}</span>
                            </NavItem>
                        ))}
                    </NavSectionWrap>

                    <NavSectionWrap>
                        <NavSectionLabel>REJA</NavSectionLabel>
                        {planNav.map(({ path, label, icon: Icon }) => (
                            <NavItem
                                key={path}
                                type="button"
                                $active={isActive(path)}
                                onClick={() => handleNavigate(path)}
                            >
                                <Icon size={16} strokeWidth={isActive(path) ? 2.5 : 2} />
                                <span>{label}</span>
                            </NavItem>
                        ))}
                    </NavSectionWrap>

                    <NavSectionWrap>
                        <NavSectionLabel>TARAQQIYOT</NavSectionLabel>
                        {progressNav.map(({ path, label, icon: Icon }) => (
                            <NavItem
                                key={path}
                                type="button"
                                $active={isActive(path)}
                                onClick={() => handleNavigate(path)}
                            >
                                <Icon size={16} strokeWidth={isActive(path) ? 2.5 : 2} />
                                <span>{label}</span>
                            </NavItem>
                        ))}
                    </NavSectionWrap>
                </Nav>

                <BottomBlock>
                    <Popover content={notifPanel} trigger="click" placement="topLeft" arrow={false} zIndex={1300}>
                        <BottomBtn type="button">
                            <Badge dot={unreadCount > 0} offset={[-2, 2]}>
                                <Bell size={15} />
                            </Badge>
                            <span>Bildirishnomalar</span>
                        </BottomBtn>
                    </Popover>
                    <UserRow type="button" onClick={() => handleNavigate("/profile")}>
                        <UserAvatar>
                            <span>{initial}</span>
                        </UserAvatar>
                        <UserInfo>
                            <UserName>{user?.ism || "Foydalanuvchi"}</UserName>
                            <UserPlan>Shaxsiy reja</UserPlan>
                        </UserInfo>
                        <ChevronRight size={14} color={colors.textSubtle} />
                    </UserRow>

                    <BottomBtn type="button" onClick={toggleTheme}>
                        {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                        <span>{theme === "dark" ? "Kunduzgi rejim" : "Tungi rejim"}</span>
                    </BottomBtn>
                    <BottomBtn type="button" $danger onClick={handleLogout}>
                        <LogOut size={15} />
                        <span>Chiqish</span>
                    </BottomBtn>
                </BottomBlock>
            </Aside>

            <Main>
                <MobileTopBar>
                    <HamburgerBtn type="button" onClick={() => setMobileOpen(true)} aria-label="Menyuni ochish">
                        <Menu size={18} />
                    </HamburgerBtn>
                    <MobileTopBarTitle>TartibOS</MobileTopBarTitle>
                </MobileTopBar>
                <Outlet />
            </Main>
        </Shell>
    );
}

export default Sidebar;