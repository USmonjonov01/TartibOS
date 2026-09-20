import { CheckCircle2, TrendingUp, Flame } from "lucide-react";
import {
    SidePane,
    SideGlow,
    SideContent,
    DashWrap,
    DashCard,
    DashStreakChip,
    DashHeaderRow,
    DashHeaderLabel,
    DashHeaderStat,
    DashBars,
    DashBar,
    DashDivider,
    DashProgressRow,
    DashProgressLabelRow,
    DashProgressTrack,
    DashProgressFill,
    SideTitle,
    SideDesc,
    SideFeatureList,
    SideFeatureItem,
} from "./style";

// Haftalik ustunlar — har biri kunlar bo'yicha "bajarilganlik" balandligini
// ko'rsatadi (statik namunaviy qiymatlar, haqiqiy foydalanuvchi ma'lumoti
// EMAS — bu faqat ro'yxatdan o'tish/kirish sahifasidagi targ'ibot rasmi).
const weekBars = [32, 48, 40, 58, 52, 78, 94];

const progressRows = [
    { label: "Kunlik odatlar", pct: 82 },
    { label: "Haftalik maqsad", pct: 64 },
    { label: "Fokus vaqti", pct: 91 },
];

const features = [
    "Maqsadingizni bosqichlarga bo'lib, AI yordamida yo'l xaritasi tuziladi",
    "Kunlik odatlar va missiyalar bitta joyda — Telegram bot bilan birga",
    "Faqat sizga tegishli: ma'lumotlaringizni boshqa hech kim ko'rmaydi",
];

// SignIn va SignUp ikkalasida ham bir xil — statistik ko'rinishdagi
// "mini-dashboard" maketi + qisqa targ'ibot matni. Bu yerdagi barcha raqam
// va ustunlar statik namuna, hech qanday API'dan olinmaydi.
const SidePanel = () => (
    <SidePane>
        <SideGlow />
        <SideContent>
            <DashWrap>
                <DashCard>
                    <DashStreakChip>
                        <Flame size={13} />
                        12 kun
                    </DashStreakChip>

                    <DashHeaderRow>
                        <DashHeaderLabel>Bu hafta</DashHeaderLabel>
                        <DashHeaderStat>
                            <TrendingUp size={14} />
                            +24%
                        </DashHeaderStat>
                    </DashHeaderRow>

                    <DashBars>
                        {weekBars.map((h, i) => (
                            <DashBar key={i} $h={h} $hi={i >= weekBars.length - 2} />
                        ))}
                    </DashBars>

                    <DashDivider />

                    {progressRows.map((row) => (
                        <DashProgressRow key={row.label}>
                            <DashProgressLabelRow>
                                {row.label}
                                <strong>{row.pct}%</strong>
                            </DashProgressLabelRow>
                            <DashProgressTrack>
                                <DashProgressFill $pct={row.pct} />
                            </DashProgressTrack>
                        </DashProgressRow>
                    ))}
                </DashCard>
            </DashWrap>

            <SideTitle>Har bir qadam sizni maqsadga yaqinlashtiradi</SideTitle>
            <SideDesc>
                TartibOS — shaxsiy intizom tizimingiz. Bir marta ro'yxatdan o'ting, qolganini u o'zi tartibga soladi.
            </SideDesc>
            <SideFeatureList>
                {features.map((f) => (
                    <SideFeatureItem key={f}>
                        <CheckCircle2 size={16} />
                        {f}
                    </SideFeatureItem>
                ))}
            </SideFeatureList>
        </SideContent>
    </SidePane>
);

export default SidePanel;
