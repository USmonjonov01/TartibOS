import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
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
    InputWrap,
    Input,
    ToggleVisibility,
    ErrorBanner,
    ErrorText,
    SubmitButton,
    FooterText,
    LinkButton,
    BackText,
    BackButton,
} from "../SignIn/style";
import { useUser } from "../../../context/users";
import TartibOSLogo from "../../../assets/icons/TartibOS1.png";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const { resetPassword } = useUser();

    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ parol: "", parol_check: "" });
    const [mismatch, setMismatch] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (field) => (e) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
        setMismatch(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.parol !== form.parol_check) {
            setMismatch(true);
            return;
        }
        if (form.parol.length < 8) {
            setError("Parol kamida 8 ta belgidan iborat bo'lishi kerak");
            return;
        }

        setLoading(true);
        try {
            await resetPassword({ token, parol: form.parol });
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Havola yaroqsiz yoki muddati o'tgan");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
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
                        <Title>Havola topilmadi</Title>
                    </Header>
                    <ErrorBanner>
                        Bu havola yaroqsiz. Parolni tiklashni qaytadan so'rang.
                    </ErrorBanner>
                    <FooterText>
                        <LinkButton as={Link} to="/forgot-password">
                            Qaytadan so'rash
                        </LinkButton>
                    </FooterText>
                </Card>
            </Wrapper>
        );
    }

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
                    <Title>Yangi parol o'rnating</Title>
                    <Subtitle>Hisobingiz uchun yangi parol kiriting</Subtitle>
                </Header>

                <Form onSubmit={handleSubmit}>
                    {error && <ErrorBanner>{error}</ErrorBanner>}

                    <Field>
                        <Label htmlFor="reset-parol">Yangi parol</Label>
                        <InputWrap>
                            <Input
                                id="reset-parol"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={form.parol}
                                onChange={handleChange("parol")}
                                autoComplete="new-password"
                                $hasIcon
                                required
                            />
                            <ToggleVisibility
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </ToggleVisibility>
                        </InputWrap>
                    </Field>

                    <Field>
                        <Label htmlFor="reset-parol-check">Parolni takrorlang</Label>
                        <Input
                            id="reset-parol-check"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={form.parol_check}
                            onChange={handleChange("parol_check")}
                            autoComplete="new-password"
                            required
                        />
                        {mismatch && <ErrorText>Parollar bir xil emas</ErrorText>}
                    </Field>

                    <SubmitButton type="submit" disabled={loading}>
                        {loading ? "Saqlanmoqda..." : "Parolni o'rnatish"}
                    </SubmitButton>
                </Form>

                <BackText>
                    <BackButton as={Link} to="/sign-in">
                        ← Kirish sahifasiga
                    </BackButton>
                </BackText>
            </Card>
        </Wrapper>
    );
};

export default ResetPassword;
