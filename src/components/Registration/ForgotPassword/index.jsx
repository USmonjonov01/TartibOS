import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Wrapper,
    Card,
    Header,
    LogoRow,
    LogoIcon,
    LogoText,
    Title,
    Subtitle,
    Form,
    Field,
    Label,
    Input,
    ErrorBanner,
    InfoBanner,
    SubmitButton,
    FooterText,
    LinkButton,
    BackText,
    BackButton,
} from "../SignIn/style";
import { useUser } from "../../../context/users";
import TartibOSLogo from "../../../assets/icons/TartibOS1.png";

// Har doim bir xil generik xabar ko'rsatiladi — backend ham xuddi shu
// prinsipda javob beradi (email mavjud yoki yo'qligidan qat'iy nazar), shu
// orqali bu forma orqali "qaysi email'lar ro'yxatdan o'tgan" deb tekshirib
// bo'lmaydi (user enumeration'dan himoya).
const ForgotPassword = () => {
    const { forgotPassword } = useUser();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await forgotPassword(email);
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Xatolik yuz berdi. Qayta urinib ko'ring.");
        } finally {
            setLoading(false);
        }
    };

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
                    <Title>Parolni tiklash</Title>
                    <Subtitle>Ro'yxatdan o'tgan emailingizni kiriting</Subtitle>
                </Header>

                {sent ? (
                    <InfoBanner>
                        Agar shu email bilan hisob mavjud bo'lsa, parolni tiklash havolasi yuborildi. Pochta
                        qutingizni (shu jumladan "spam" bo'limini ham) tekshiring.
                    </InfoBanner>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        {error && <ErrorBanner>{error}</ErrorBanner>}

                        <Field>
                            <Label htmlFor="forgot-email">Email</Label>
                            <Input
                                id="forgot-email"
                                type="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                autoFocus
                                required
                            />
                        </Field>

                        <SubmitButton type="submit" disabled={loading}>
                            {loading ? "Yuborilmoqda..." : "Tiklash havolasini yuborish"}
                        </SubmitButton>
                    </Form>
                )}

                <FooterText>
                    Parolni eslab qoldingizmi?{" "}
                    <LinkButton as={Link} to="/sign-in">
                        Kirish
                    </LinkButton>
                </FooterText>
                <BackText>
                    <BackButton as={Link} to="/home">
                        ← Bosh sahifaga
                    </BackButton>
                </BackText>
            </Card>
        </Wrapper>
    );
};

export default ForgotPassword;
