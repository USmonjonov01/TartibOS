import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";
import {
    Wrapper,
    Inner,
    IllustrationWrap,
    Eyebrow,
    CodeNumber,
    Title,
    Subtitle,
    PathTag,
    ActionsRow,
    PrimaryButton,
    SecondaryButton,
    colors,
} from "./style";

// Tog' siluetidagi uzilgan yo'lak + yo'ldan chetga chiqib qolgan nuqta —
// "siz xaritada belgilanmagan hududdasiz" fikrini bildiradi. Loyihaning
// "Balandlik jurnali" (Ascent Log) konsepsiyasiga mos ravishda qo'lda
// chizilgan SVG (Dashboard'dagi DisciplineRing bilan bir xil yondashuv).
const LostTrailIllustration = () => (
    <svg width="140" height="100" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M6 88 L34 40 L50 62 L72 18 L96 58 L112 34 L134 88"
            stroke={colors.hairline}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
        />
        <path
            d="M10 90 Q 40 78 58 68"
            stroke={colors.amber}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="5 6"
        />
        <circle cx="58" cy="68" r="4" fill={colors.amber} />
        <path
            d="M66 74 Q 78 84 92 90"
            stroke={colors.textMuted}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="3 5"
            opacity="0.6"
        />
        <circle cx="92" cy="90" r="3" fill={colors.textMuted} opacity="0.6" />
        <text x="70" y="30" textAnchor="middle" fontSize="16" fill={colors.amberStrong}>
            ?
        </text>
    </svg>
);

const NotFound = () => {
    const location = useLocation();

    return (
        <Wrapper>
            <Inner>
                <IllustrationWrap>
                    <LostTrailIllustration />
                </IllustrationWrap>

                <Eyebrow>Yo'qolgan yo'lak</Eyebrow>
                <CodeNumber>
                    4<span>0</span>4
                </CodeNumber>
                <Title>Bu yo'lak xaritada yo'q</Title>
                <Subtitle>
                    Siz izlagan sahifa mavjud emas yoki boshqa manzilga ko'chirilgan. Xarita bo'yicha{" "}
                    <PathTag>{location.pathname}</PathTag> manzili qayd etilmagan — lekin xavotir olmang,
                    bazaviy lager hamon joyida.
                </Subtitle>

                <ActionsRow>
                    <PrimaryButton as={Link} to="/dashboard">
                        <Compass size={16} /> Bazaviy lagerga qaytish
                    </PrimaryButton>
                    <SecondaryButton as={Link} to="/home">
                        <ArrowLeft size={15} /> Bosh sahifa
                    </SecondaryButton>
                </ActionsRow>
            </Inner>
        </Wrapper>
    );
};

export default NotFound;