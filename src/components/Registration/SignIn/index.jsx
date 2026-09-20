import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import {
    SplitWrapper,
    FormPane,
    FormInner,
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
    SubmitButton,
    FooterText,
    LinkButton,
    BackText,
    BackButton,
    Divider,
    LabelRow,
    ForgotLink,
} from "./style";
import { useUser } from "../../../context/users";
import GoogleButton from "../GoogleButton";
import SidePanel from "../SidePanel";
import TartibOSLogo from "../../../assets/icons/TartibOS1.png"

const SignIn = () => {
    const navigate = useNavigate();
    const { login, loading, error, clearError } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: "", parol: "" });
    const [googleError, setGoogleError] = useState("");

    const handleChange = (field) => (e) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        try {
            await login(form);
            navigate("/dashboard");
        } catch {
            // xatolik context ichida "error" holatiga yoziladi va pastda ko'rsatiladi
        }
    };

    return (
        <SplitWrapper>
            <FormPane>
                <FormInner>
                    <Header>
                        <LogoRow>
                            <LogoIcon>
                                <img width="100%" style={{ overflow: "hidden", borderRadius: "6px" }} src={TartibOSLogo} alt="TartibOS" />
                            </LogoIcon>
                            <LogoText>TartibOS</LogoText>
                        </LogoRow>
                        <Title>Xush kelibsiz</Title>
                        <Subtitle>Hisobingizga kiring</Subtitle>
                    </Header>

                    {(error || googleError) && <ErrorBanner>{error || googleError}</ErrorBanner>}

                    <GoogleButton label="signin_with" onError={() => setGoogleError("Google bilan kirishda xatolik yuz berdi")} />
                    <Divider>yoki</Divider>

                    <Form onSubmit={handleSubmit}>
                        <Field>
                            <Label htmlFor="signin-email">Email</Label>
                            <Input
                                id="signin-email"
                                type="email"
                                placeholder="email@example.com"
                                value={form.email}
                                onChange={handleChange("email")}
                                autoComplete="email"
                                required
                            />
                        </Field>

                        <Field>
                            <LabelRow>
                                <Label htmlFor="signin-parol">Parol</Label>
                                <ForgotLink as={Link} to="/forgot-password">
                                    Parolni unutdingizmi?
                                </ForgotLink>
                            </LabelRow>
                            <InputWrap>
                                <Input
                                    id="signin-parol"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={form.parol}
                                    onChange={handleChange("parol")}
                                    autoComplete="current-password"
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

                        <SubmitButton type="submit" disabled={loading}>
                            {loading ? "Kirilmoqda..." : "Kirish"}
                        </SubmitButton>
                    </Form>

                    <FooterText>
                        Hisobingiz yo'qmi?{" "}
                        <LinkButton as={Link} to="/sign-up">
                            Ro'yxatdan o'ting
                        </LinkButton>
                    </FooterText>
                    <BackText>
                        <BackButton as={Link} to="/home">
                            ← Bosh sahifaga
                        </BackButton>
                    </BackText>
                </FormInner>
            </FormPane>

            <SidePanel />
        </SplitWrapper>
    );
};

export default SignIn;
