import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    CheckCircle2,
    BarChart2,
    RefreshCw,
    Target,
    FileText,
    Shield,
} from "lucide-react";
import {
    Wrapper,
    Nav,
    NavInner,
    LogoBox,
    LogoIcon,
    LogoText,
    NavActions,
    BtnGhost,
    BtnPrimary,
    BtnPrimaryLg,
    BtnSecondaryLg,
    BtnCta,
    HeroSection,
    HeroInner,
    Badge,
    BadgeDot,
    HeroTitle,
    GradientSpan,
    HeroDesc,
    HeroActions,
    PreviewCard,
    PreviewBar,
    PreviewDot,
    PreviewUrl,
    PreviewBody,
    MiniSidebar,
    MiniLogoRow,
    MiniLogoIcon,
    MiniLogoText,
    MiniNavItem,
    MiniContent,
    MiniDate,
    MiniGreeting,
    MiniStatsGrid,
    MiniStatCard,
    MiniStatLabel,
    MiniStatValue,
    MiniHabitsCard,
    MiniHabitsTitle,
    MiniHabitRow,
    MiniHabitDot,
    MiniHabitName,
    FeaturesSection,
    FeaturesHeader,
    FeaturesTitle,
    FeaturesDesc,
    FeaturesGrid,
    FeatureCard,
    FeatureIconBox,
    FeatureTitle,
    FeatureDesc,
    CTASection,
    CTABox,
    CTATitle,
    CTADesc,
    Footer,
    colors,
} from "./style";

const features = [
    {
        icon: CheckCircle2,
        color: colors.primary,
        bg: colors.primaryLight,
        title: "Fundamental odatlar",
        desc: "Kundalik tizimingizni fundamental odatlar asosida quring. Har bir kun uchun aniq yo'l xaritasi.",
    },
    {
        icon: Target,
        color: colors.accent,
        bg: colors.accentLight,
        title: "Missiyalar",
        desc: "Kunlik, haftalik va kelgusi missiyalarni boshqaring. Muhimlik darajasi bilan tartiblang.",
    },
    {
        icon: BarChart2,
        color: colors.success,
        bg: colors.successLight,
        title: "Statistika",
        desc: "Intizom va ijro ko'rsatkichlaringizni kuzating. Ma'lumotga asoslangan qarorlar qabul qiling.",
    },
    {
        icon: FileText,
        color: colors.warning,
        bg: colors.warningLight,
        title: "Kunlik review",
        desc: "Har kuni refleksiya qiling. Yutuqlar va xatolardan o'rganing. Ertangi kun uchun fokus qiling.",
    },
    {
        icon: RefreshCw,
        color: colors.primary,
        bg: colors.primaryLight,
        title: "Routine tizimi",
        desc: "Versiyalangan odat tizimi. O'zgarishlarni kuzating va odatlaringizni doimiy takomillashtiring.",
    },
    {
        icon: Shield,
        color: colors.accent,
        bg: colors.accentLight,
        title: "Shaxsiy tizim",
        desc: "TartibOS faqat sizning tizimingiz. Ma'lumotlar xavfsiz, interfeys toza va qulay.",
    },
];

const miniNav = [
    { label: "Dashboard", active: true },
    { label: "Missions", active: false },
    { label: "Routine", active: false },
    { label: "Statistics", active: false },
    { label: "Review", active: false },
];

const miniHabits = [
    { name: "☀️ Ertalabki routine", done: true },
    { name: "💪 Sport", done: true },
    { name: "📖 Kitob o'qish", done: false },
];

const Home = () => {
    const navigate = useNavigate();

    return (
        <Wrapper>
            {/* Nav */}
            <Nav>
                <NavInner>
                    <LogoBox>
                        <LogoIcon>
                            <span>T</span>
                        </LogoIcon>
                        <LogoText>TartibOS</LogoText>
                    </LogoBox>
                    <NavActions>
                        <BtnGhost onClick={() => navigate("/sign-in")}>
                            Kirish
                        </BtnGhost>
                        <BtnPrimary onClick={() => navigate("/sign-up")}>
                            Boshlash
                        </BtnPrimary>
                    </NavActions>
                </NavInner>
            </Nav>

            {/* Hero */}
            <HeroSection>
                <HeroInner>
                    <Badge>
                        <BadgeDot />
                        Shaxsiy intizom tizimi
                    </Badge>

                    <HeroTitle>
                        Tartibni <GradientSpan>tizimga</GradientSpan> aylantir.
                    </HeroTitle>

                    <HeroDesc>
                        TartibOS kundalik odatlar, missiyalar va progressni
                        boshqarishga yordam beradigan shaxsiy intizom tizimi.
                    </HeroDesc>

                    <HeroActions>
                        <BtnPrimaryLg onClick={() => navigate("/sign-up")}>
                            Bepul boshlash <ArrowRight size={18} />
                        </BtnPrimaryLg>
                        <BtnSecondaryLg onClick={() => navigate("/dashboard")}>
                            Demo ko'rish →
                        </BtnSecondaryLg>
                    </HeroActions>
                </HeroInner>

                {/* App preview */}
                <PreviewCard>
                    <PreviewBar>
                        <PreviewDot $color="#FCA5A5" />
                        <PreviewDot $color="#FCD34D" />
                        <PreviewDot $color="#6EE7B7" />
                        <PreviewUrl>
                            <span>tartibos.app/dashboard</span>
                        </PreviewUrl>
                    </PreviewBar>

                    <PreviewBody>
                        <MiniSidebar>
                            <MiniLogoRow>
                                <MiniLogoIcon>
                                    <span>T</span>
                                </MiniLogoIcon>
                                <MiniLogoText>TartibOS</MiniLogoText>
                            </MiniLogoRow>
                            {miniNav.map((item) => (
                                <MiniNavItem
                                    key={item.label}
                                    $active={item.active}
                                >
                                    {item.label}
                                </MiniNavItem>
                            ))}
                        </MiniSidebar>

                        <MiniContent>
                            <MiniDate>Dushanba, 10-avgust</MiniDate>
                            <MiniGreeting>
                                Xayrli tong, Azizbek 👋
                            </MiniGreeting>

                            <MiniStatsGrid>
                                <MiniStatCard>
                                    <MiniStatLabel>Intizom</MiniStatLabel>
                                    <MiniStatValue>72%</MiniStatValue>
                                </MiniStatCard>
                                <MiniStatCard>
                                    <MiniStatLabel>Streak</MiniStatLabel>
                                    <MiniStatValue>12 kun</MiniStatValue>
                                </MiniStatCard>
                            </MiniStatsGrid>

                            <MiniHabitsCard>
                                <MiniHabitsTitle>
                                    Fundamental odatlar
                                </MiniHabitsTitle>
                                {miniHabits.map((h, i) => (
                                    <MiniHabitRow key={i}>
                                        <MiniHabitDot $done={h.done} />
                                        <MiniHabitName $done={h.done}>
                                            {h.name}
                                        </MiniHabitName>
                                    </MiniHabitRow>
                                ))}
                            </MiniHabitsCard>
                        </MiniContent>
                    </PreviewBody>
                </PreviewCard>
            </HeroSection>

            {/* Features */}
            <FeaturesSection>
                <FeaturesHeader>
                    <FeaturesTitle>Hamma narsa bir joyda</FeaturesTitle>
                    <FeaturesDesc>
                        TartibOS kundalik hayotingizni boshqarish uchun zarur
                        bo'lgan barcha vositalarni birlashtiradi.
                    </FeaturesDesc>
                </FeaturesHeader>

                <FeaturesGrid>
                    {features.map((f, i) => {
                        const Icon = f.icon;
                        return (
                            <FeatureCard key={i}>
                                <FeatureIconBox $bg={f.bg}>
                                    <Icon size={22} color={f.color} />
                                </FeatureIconBox>
                                <FeatureTitle>{f.title}</FeatureTitle>
                                <FeatureDesc>{f.desc}</FeatureDesc>
                            </FeatureCard>
                        );
                    })}
                </FeaturesGrid>
            </FeaturesSection>

            {/* CTA */}
            <CTASection>
                <CTABox>
                    <CTATitle>Bugundan boshlang</CTATitle>
                    <CTADesc>
                        Minglab odamlar TartibOS bilan kundalik
                        intizomlarini yaxshilashyapti. Siz ham qo'shiling.
                    </CTADesc>
                    <BtnCta onClick={() => navigate("/sign-up")}>
                        Hisob yaratish <ArrowRight size={18} />
                    </BtnCta>
                </CTABox>
            </CTASection>

            {/* Footer */}
            <Footer>
                <span>© 2026 TartibOS — Shaxsiy intizom tizimi</span>
            </Footer>
        </Wrapper>
    );
};

export default Home;
