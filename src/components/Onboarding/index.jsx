import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/users";
import GoalWizard from "../GoalWizard";
import { Page, Welcome, WelcomeEyebrow, WelcomeText, Card } from "./style";

// Yangi foydalanuvchi ro'yxatdan o'tgach shu yerga keladi (SignUp / Google'dan
// yangi hisob). Avval maqsad qo'yiladi → AI yo'l xaritasi → AI kun tartibi,
// shundan keyingina Dashboard ochiladi. Foydalanuvchi xohlasa o'tkazib yuborishi
// mumkin — hech narsa majburlanmaydi.
function Onboarding() {
    const navigate = useNavigate();
    const { user } = useUser();
    const firstName = user?.ism?.trim()?.split(/\s+/)[0];

    return (
        <Page>
            <Welcome>
                <WelcomeEyebrow>TartibOS</WelcomeEyebrow>
                <WelcomeText>
                    {firstName ? `Xush kelibsiz, ${firstName}! ` : "Xush kelibsiz! "}
                    Boshlashdan oldin bitta narsani hal qilamiz: nima uchun aynan shu yerdasiz? Maqsadingizni
                    yozing — qolgan yo'lni birga quramiz.
                </WelcomeText>
            </Welcome>

            <Card>
                <GoalWizard
                    skipLabel="Hozircha o'tkazib yuborish"
                    onSkip={() => navigate("/dashboard", { replace: true })}
                    onFinish={({ to }) => navigate(to || "/dashboard", { replace: true })}
                />
            </Card>
        </Page>
    );
}

export default Onboarding;
