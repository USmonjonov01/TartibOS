import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "./style";
import { useUser } from "../../../context/users";

const SignUp = () => {
    const navigate = useNavigate();
    const { register, loading, error, clearError } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        ism: "",
        email: "",
        parol: "",
        parol_check: "",
    });
    const [mismatch, setMismatch] = useState(false);

    const handleChange = (field) => (e) => {
        const { value } = e.target;
        setForm((f) => ({ ...f, [field]: value }));
        if (field === "parol" || field === "parol_check") {
            setMismatch(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();

        if (form.parol !== form.parol_check) {
            setMismatch(true);
            return;
        }

        try {
            await register(form);
            navigate("/dashboard");
        } catch {
            // xatolik context ichida "error" holatiga yoziladi va yuqorida ko'rsatiladi
        }
    };

    return (
        <Wrapper>
            <Card>
                <Header>
                    <LogoRow>
                        <LogoIcon>
                            <span>T</span>
                        </LogoIcon>
                        <LogoText>TartibOS</LogoText>
                    </LogoRow>
                    <Title>Hisob yaratish</Title>
                    <Subtitle>TartibOS bilan intizomingizni boshlang</Subtitle>
                </Header>

                <Form onSubmit={handleSubmit}>
                    {error && <ErrorBanner>{error}</ErrorBanner>}

                    <Field>
                        <Label htmlFor="signup-ism">Ism</Label>
                        <Input
                            id="signup-ism"
                            placeholder="To'liq ismingiz"
                            value={form.ism}
                            onChange={handleChange("ism")}
                            autoComplete="name"
                            required
                        />
                    </Field>

                    <Field>
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                            id="signup-email"
                            type="email"
                            placeholder="email@example.com"
                            value={form.email}
                            onChange={handleChange("email")}
                            autoComplete="email"
                            required
                        />
                    </Field>

                    <Field>
                        <Label htmlFor="signup-parol">Parol</Label>
                        <InputWrap>
                            <Input
                                id="signup-parol"
                                type={showPassword ? "text" : "password"}
                                placeholder="Kamida 8 ta belgi"
                                value={form.parol}
                                onChange={handleChange("parol")}
                                autoComplete="new-password"
                                minLength={8}
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
                        <Label htmlFor="signup-parol-check">Parolni tasdiqlang</Label>
                        <Input
                            id="signup-parol-check"
                            type="password"
                            placeholder="Parolni qayta kiriting"
                            value={form.parol_check}
                            onChange={handleChange("parol_check")}
                            autoComplete="new-password"
                            $error={mismatch}
                            required
                        />
                        {mismatch && <ErrorText>Parollar mos kelmadi</ErrorText>}
                    </Field>

                    <SubmitButton type="submit" disabled={loading}>
                        {loading ? "Yaratilmoqda..." : "Hisob yaratish"}
                    </SubmitButton>
                </Form>

                <FooterText>
                    Hisobingiz bormi?{" "}
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

export default SignUp;
