import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import {
    Wrapper,
    Card,
    Header,
    LogoRow,
    LogoIcon,
    LogoText,
    Title,
    ErrorBanner,
    InfoBanner,
    SubmitButton,
    FooterText,
    BackText,
    BackButton,
} from "../SignIn/style";
import { useUser } from "../../../context/users";
import TartibOSLogo from "../../../assets/icons/TartibOS1.png";

// Uch holat: "loading" (token tekshirilyapti), "success", "error".
// Token faqat BIR MARTA ishlatilishi kerak bo'lgani uchun so'rov mount
// paytida avtomatik, faqat bir marta yuboriladi (StrictMode'da effekt ikki
// marta chaqirilishining oldi ref bilan olinadi).
const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const { verifyEmail } = useUser();
    const [status, setStatus] = useState(token ? "loading" : "missing");
    const [message, setMessage] = useState("");
    const sentRef = useRef(false);

    useEffect(() => {
        if (!token || sentRef.current) return;
        sentRef.current = true;

        verifyEmail(token)
            .then(() => setStatus("success"))
            .catch((err) => {
                setMessage(err.response?.data?.message || err.message || "Havola yaroqsiz yoki muddati o'tgan");
                setStatus("error");
            });
    }, [token, verifyEmail]);

    return (
        <Wrapper>
            <Card>
                <Header>
                    <LogoRow>
                        <LogoIcon>
                            <img width="100%" style={{ overflow: "hidden", borderRadius: "6px" }} src={TartibOSLogo} alt="TartibOS" />
                        </LogoIcon>
                        <LogoText>TartibOS</LogoText>
                    </LogoRow>
                    <Title>Email tasdiqlash</Title>
                </Header>

                {status === "loading" && (
                    <InfoBanner style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Loader2 size={16} />
                        Tekshirilmoqda...
                    </InfoBanner>
                )}

                {status === "success" && (
                    <InfoBanner style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <CheckCircle2 size={16} />
                        Emailingiz muvaffaqiyatli tasdiqlandi!
                    </InfoBanner>
                )}

                {status === "error" && (
                    <ErrorBanner style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <XCircle size={16} />
                        {message}
                    </ErrorBanner>
                )}

                {status === "missing" && (
                    <ErrorBanner>Havola yaroqsiz — tasdiqlash tokeni topilmadi.</ErrorBanner>
                )}

                <FooterText style={{ marginTop: 16 }}>
                    <SubmitButton as={Link} to="/dashboard" style={{ textDecoration: "none", display: "inline-block" }}>
                        Boshqaruv paneliga o'tish
                    </SubmitButton>
                </FooterText>
                <BackText>
                    <BackButton as={Link} to="/sign-in">
                        ← Kirish sahifasiga
                    </BackButton>
                </BackText>
            </Card>
        </Wrapper>
    );
};

export default VerifyEmail;
