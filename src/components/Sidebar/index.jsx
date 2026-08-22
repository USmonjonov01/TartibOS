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
} from "lucide-react";
import { useUser } from "../../context/users";
import { useNotifications } from "../../context/notifications";
import { Shell, Aside, LogoBlock, LogoRow, LogoIcon, LogoTextBlock, LogoTitle, LogoSubtitle, Nav, NavSectionWrap, NavSectionLabel, NavItem, BottomBlock, UserRow, UserAvatar, UserInfo, UserName, UserPlan, BottomBtn, Main, colors, NotifPanel, NotifHeader, NotifHeaderTitle, NotifMarkRead, NotifList, NotifItem, NotifDot, NotifBody, NotifTitle, NotifDesc, NotifTime, NotifEmpty,} from "./style";

const mainNav = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/missions", label: "Missions", icon: Target },
    { path: "/routine", label: "Routine", icon: RefreshCw },
];

const insightsNav = [
    { path: "/statistics", label: "Statistics", icon: BarChart2 },
    { path: "/history", label: "Tarix", icon: CalendarClock },
    { path: "/review", label: "Review", icon: FileText },
];

const formatNotifTime = (iso) =>
    new Date(iso).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useUser();
    const { history, unreadCount, markAllRead } = useNotifications();

    const isActive = (path) => location.pathname.startsWith(path);

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
            <Aside>
                <LogoBlock>
                    <LogoRow>
                        <LogoIcon>
                            <span>T</span>
                        </LogoIcon>
                        <LogoTextBlock>
                            <LogoTitle>TartibOS</LogoTitle>
                            <LogoSubtitle>Shaxsiy tizim</LogoSubtitle>
                        </LogoTextBlock>
                    </LogoRow>
                </LogoBlock>

                <Nav>
                    <NavSectionWrap>
                        <NavSectionLabel>ASOSIY</NavSectionLabel>
                        {mainNav.map(({ path, label, icon: Icon }) => (
                            <NavItem
                                key={path}
                                type="button"
                                $active={isActive(path)}
                                onClick={() => navigate(path)}
                            >
                                <Icon size={16} strokeWidth={isActive(path) ? 2.5 : 2} />
                                <span>{label}</span>
                            </NavItem>
                        ))}
                    </NavSectionWrap>

                    <NavSectionWrap>
                        <NavSectionLabel>TAHLIL</NavSectionLabel>
                        {insightsNav.map(({ path, label, icon: Icon }) => (
                            <NavItem
                                key={path}
                                type="button"
                                $active={isActive(path)}
                                onClick={() => navigate(path)}
                            >
                                <Icon size={16} strokeWidth={isActive(path) ? 2.5 : 2} />
                                <span>{label}</span>
                            </NavItem>
                        ))}
                    </NavSectionWrap>
                </Nav>

                <BottomBlock>
                    <Popover content={notifPanel} trigger="click" placement="topLeft" arrow={false}>
                        <BottomBtn type="button">
                            <Badge dot={unreadCount > 0} offset={[-2, 2]}>
                                <Bell size={15} />
                            </Badge>
                            <span>Bildirishnomalar</span>
                        </BottomBtn>
                    </Popover>
                    <UserRow type="button" onClick={() => navigate("/profile")}>
                        <UserAvatar>
                            <span>{initial}</span>
                        </UserAvatar>
                        <UserInfo>
                            <UserName>{user?.ism || "Foydalanuvchi"}</UserName>
                            <UserPlan>Shaxsiy reja</UserPlan>
                        </UserInfo>
                        <ChevronRight size={14} color={colors.textSubtle} />
                    </UserRow>

                    <BottomBtn type="button" onClick={() => navigate("/profile")}>
                        <Settings size={15} />
                        <span>Sozlamalar</span>
                    </BottomBtn>
                    <BottomBtn type="button" $danger onClick={handleLogout}>
                        <LogOut size={15} />
                        <span>Chiqish</span>
                    </BottomBtn>
                </BottomBlock>
            </Aside>

            <Main>
                <Outlet />
            </Main>
        </Shell>
    );
}

export default Sidebar;