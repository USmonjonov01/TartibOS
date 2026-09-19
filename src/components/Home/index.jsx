import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    CheckCircle2,
    BarChart2,
    RefreshCw,
    Target,
    FileText,
    Shield,
    ChevronDown,
    Lock,
    UserCheck,
    SlidersHorizontal,
    Send,
    Sparkles,
    Bot,
    LineChart,
    Circle,
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
    StepsSection,
    StepsHeader,
    StepsEyebrow,
    StepsTitle,
    StepsGrid,
    StepCard,
    StepNumber,
    StepTitle,
    StepDesc,
    FAQSection,
    FAQHeader,
    FAQTitle,
    FAQList,
    FAQItem,
    FAQQuestion,
    FAQAnswer,
    FAQAnswerInner,
    Footer,
    colors,
    TrustSection,
    TrustBox,
    TrustHeader,
    TrustEyebrow,
    TrustTitle,
    TrustLead,
    TrustGrid,
    TrustCard,
    TrustIconBox,
    TrustCardTitle,
    TrustCardDesc,
    AISection,
    AIHeader,
    AIBadge,
    AITitle,
    AIDesc,
    AITimeline,
    AIStageCard,
    AIStageStatus,
    AIStageDot,
    AIStageTitle,
    AIStageList,
    AIStageItem,
} from "./style";
import TartibOSLogo from "../../assets/icons/TartibOS1.png"
import DashboardPage from "../../assets/images/image.png"


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

const steps = [
    {
        title: "Ro'yxatdan o'ting",
        desc: "Bir necha soniyada hisob yarating — murakkab sozlash shart emas.",
    },
    {
        title: "Tizimingizni quring",
        desc: "Fundamental odatlar, missiyalar va routine'laringizni kiriting.",
    },
    {
        title: "Kuzatib boring",
        desc: "Har kuni belgilang, baholang — tizim statistikangizni o'zi hisoblaydi.",
    },
];

const trustPoints = [
    {
        icon: Lock,
        title: "Faqat sizga tegishli",
        desc: "Har bir odat, missiya va yozuv baza darajasida sizning hisobingizga bog'langan. Boshqa hech kim — hatto TartibOS jamoasi ham — ma'lumotlaringizni ko'rmaydi.",
    },
    {
        icon: UserCheck,
        title: "Reklama va tashqi ta'sir yo'q",
        desc: "TartibOS sizga hech narsa sotmaydi, ma'lumotlaringizni uchinchi tomonlarga bermaydi. Bu — sizning shaxsiy intizom kundaligingiz.",
    },
    {
        icon: SlidersHorizontal,
        title: "To'liq moslashuvchan",
        desc: "Odatlar, missiyalar va maqsadlar — bari siz belgilagan tuzilma bo'yicha ishlaydi. Boshqa birov uchun yozilgan shablon emas.",
    },
    {
        icon: Send,
        title: "Telegram bilan birga yuradi",
        desc: "Eslatmalar va kunlik missiyalar Telegram botga ham keladi — tizim doim qo'lingizning ostida, brauzerni ochmasangiz ham.",
    },
];

const aiStages = [
    {
        status: "live",
        statusLabel: "Hozir ishlayapti",
        title: "AI bilan maqsad yo'l xaritasi",
        pulse: true,
        items: [
            { done: true, text: "Yo'l xaritasida yangi maqsad kiritsangiz, AI uni boshidan oxirigacha bosqichlarga bo'lib beradi" },
            { done: true, text: "Har bir bosqich uchun aniq unvon (masalan \"Junior Backend\") ham AI tomonidan taklif qilinadi" },
            { done: true, text: "Telegram bot orqali kunlik missiya va eslatmalar avtomatik yetkaziladi" },
        ],
    },
    {
        status: "next",
        statusLabel: "Tez orada",
        title: "Shaxsiy AI tahlilchi",
        items: [
            { text: "Statistikangiz asosida haftalik AI xulosasi — qayerda kuchli, qayerda tanaffus qilayotganingiz" },
            { text: "Kunlik review'ni AI o'qib, ertangi kun uchun bitta aniq fokus taklif qiladi" },
            { text: "Odat bajarilish vaqtingizga qarab eslatmalarni aqlli qayta rejalashtirish" },
        ],
    },
    {
        status: "future",
        statusLabel: "Kelajak rejasi",
        title: "To'liq AI hamrohlik",
        items: [
            { text: "Telegram botdagi suhbat orqali AI koch — savol-javob tarzida maslahat" },
            { text: "Ovozli xabar bilan missiya va odat qo'shish" },
            { text: "Uzoq muddatli maqsadlar uchun bashoratli progress tahlili" },
        ],
    },
];

const faqs = [
    {
        q: "TartibOS bepulmi?",
        a: "Ha, TartibOS'ning asosiy imkoniyatlari — odatlar, missiyalar, statistika va review — bepul.",
    },
    {
        q: "Ma'lumotlarim xavfsizmi?",
        a: "Ma'lumotlaringiz shifrlangan holda saqlanadi va faqat sizga tegishli. Hech kim boshqa foydalanuvchi ma'lumotlariga kira olmaydi.",
    },
    {
        q: "Mobil qurilmada ishlaydimi?",
        a: "Ha, TartibOS istalgan brauzerda — kompyuter yoki telefonda — bab-baravar qulay ishlaydi.",
    },
    {
        q: "Odatlarimni qanday baholayman?",
        a: "Har bir odatni bajarganingizda 5 yulduzchagacha baho berasiz. Bu tizimga odatning shunchaki bajarilganini emas, qanchalik sifatli bajarilganini ham hisobga olish imkonini beradi.",
    },
];

const Home = () => {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState(0);

    return (
        <Wrapper>
            {/* Nav */}
            <Nav>
                <NavInner>
                    <LogoBox>
                        <LogoIcon>
                            <img width="100%" style={{ overflow: "hidden", borderRadius: "6px" }} src={TartibOSLogo} alt="TartibOS" />
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
                    </HeroActions>
                </HeroInner>

                {/* App preview */}
                <PreviewCard>
               <img width="100%" style={{ overflow: "hidden", borderRadius: "6px" }} src={DashboardPage}/>
                </PreviewCard>
            </HeroSection>

            <br />
            <br />
            <br />

            {/* "Bu mening shaxsiy tizimimmi?" javobi */}
            <TrustSection>
                <TrustBox>
                    <TrustHeader>
                        <TrustEyebrow>Shaxsiylik</TrustEyebrow>
                        <TrustTitle>TartibOS — bu to'liq sizning shaxsiy tizimingiz</TrustTitle>
                        <TrustLead>
                            TartibOS umumiy shablon emas. Har bir hisob alohida, ma'lumotlar bazasi darajasida
                            izolyatsiya qilingan — siz kiritgan odat, missiya va maqsad faqat sizga ko'rinadi va
                            faqat siz uchun ishlaydi.
                        </TrustLead>
                    </TrustHeader>
                    <TrustGrid>
                        {trustPoints.map((t) => {
                            const Icon = t.icon;
                            return (
                                <TrustCard key={t.title}>
                                    <TrustIconBox>
                                        <Icon size={18} color={colors.primary} />
                                    </TrustIconBox>
                                    <TrustCardTitle>{t.title}</TrustCardTitle>
                                    <TrustCardDesc>{t.desc}</TrustCardDesc>
                                </TrustCard>
                            );
                        })}
                    </TrustGrid>
                </TrustBox>
            </TrustSection>

            {/* AI integratsiyasi yo'l xaritasi */}
            <AISection>
                <AIHeader>
                    <AIBadge>
                        <Sparkles size={13} />
                        AI integratsiyasi
                    </AIBadge>
                    <AITitle>TartibOS AI bilan birga o'sadi</AITitle>
                    <AIDesc>
                        Sun'iy intellekt TartibOS'da allaqachon ishlayapti — va bu faqat boshlanish. Quyida hozirgi
                        holat va kelgusi rejalarni ko'rishingiz mumkin.
                    </AIDesc>
                </AIHeader>
                <AITimeline>
                    {aiStages.map((stage) => {
                        const StatusIcon = stage.status === "live" ? Sparkles : stage.status === "next" ? LineChart : Bot;
                        return (
                            <AIStageCard key={stage.title} $status={stage.status}>
                                <AIStageStatus $status={stage.status}>
                                    <AIStageDot $pulse={stage.pulse} />
                                    {stage.statusLabel}
                                </AIStageStatus>
                                <AIStageTitle>
                                    <StatusIcon size={15} style={{ marginRight: 6, verticalAlign: -2 }} />
                                    {stage.title}
                                </AIStageTitle>
                                <AIStageList>
                                    {stage.items.map((item, i) => (
                                        <AIStageItem key={i} $done={item.done}>
                                            {item.done ? <CheckCircle2 size={14} /> : <Circle size={8} style={{ marginTop: 5 }} />}
                                            {item.text}
                                        </AIStageItem>
                                    ))}
                                </AIStageList>
                            </AIStageCard>
                        );
                    })}
                </AITimeline>
            </AISection>

            {/* Qanday ishlaydi */}
            <StepsSection>
                <StepsHeader>
                    <StepsEyebrow>Qanday ishlaydi</StepsEyebrow>
                    <StepsTitle>Uch qadamda boshlang</StepsTitle>
                </StepsHeader>
                <StepsGrid>
                    {steps.map((step, i) => (
                        <StepCard key={step.title}>
                            <StepNumber>{i + 1}</StepNumber>
                            <StepTitle>{step.title}</StepTitle>
                            <StepDesc>{step.desc}</StepDesc>
                        </StepCard>
                    ))}
                </StepsGrid>
            </StepsSection>

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

            {/* FAQ */}
            <FAQSection>
                <FAQHeader>
                    <FAQTitle>Savol-javoblar</FAQTitle>
                </FAQHeader>
                <FAQList>
                    {faqs.map((item, i) => {
                        const isOpen = openFaq === i;
                        return (
                            <FAQItem key={item.q}>
                                <FAQQuestion
                                    type="button"
                                    $open={isOpen}
                                    onClick={() => setOpenFaq(isOpen ? null : i)}
                                >
                                    {item.q}
                                    <ChevronDown size={18} />
                                </FAQQuestion>
                                <FAQAnswer $open={isOpen}>
                                    <FAQAnswerInner>{item.a}</FAQAnswerInner>
                                </FAQAnswer>
                            </FAQItem>
                        );
                    })}
                </FAQList>
            </FAQSection>

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
