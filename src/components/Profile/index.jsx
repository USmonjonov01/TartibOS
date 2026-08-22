import { useCallback, useEffect, useMemo, useState } from "react";
import { UserRound, KeyRound, LogOut, Compass } from "lucide-react";
import { useUser } from "../../context/users";
import { useRoutine } from "../../context/routine";
import { useWeeks } from "../../context/weaks";
import { missionApi } from "../../axios";
import { filterByOwner } from "../../utils/ownership";
import { dedupeRoutines } from "../../utils/routine";
import {
    Wrapper,
    Inner,
    HeaderRow,
    Eyebrow,
    Title,
    Subtitle,
    SuccessBanner,
    IdentityCard,
    AvatarCircle,
    IdentityBody,
    UserName,
    UserEmail,
    UserSince,
    StatGrid,
    StatCard,
    StatLabel,
    StatValue,
    SectionCard,
    SectionHead,
    SectionTitle,
    SectionCaption,
    FormGrid,
    Field,
    FieldLabel,
    Input,
    FieldError,
    SaveBtn,
    DangerZone,
    DangerText,
    LogoutBtn,
} from "./style";

const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    return parts
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("");
};

const formatJoinDate = (value) => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });
};

const Profile = () => {
    const { user, logout, updateProfile } = useUser();
    const { routines, fetchRoutines } = useRoutine();
    const { weeks, fetchWeeks } = useWeeks();

    const [missions, setMissions] = useState([]);
    const fetchMissions = useCallback(async () => {
        if (!user) return;
        try {
            const { data } = await missionApi.get("/missions");
            const list = data.missions || data || [];
            setMissions(Array.isArray(list) ? list.filter((m) => !m.cancelled && !m.__container) : []);
        } catch {
            // Safar statistikasi ixtiyoriy — kelmasa ham sahifa ishlashda davom etadi
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;
        fetchRoutines();
        fetchWeeks();
        // eslint-disable-next-line react-hooks/set-state-in-effect -- montaj vaqtida ma'lumot olish, standart pattern
        fetchMissions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const totalHabits = useMemo(() => dedupeRoutines(routines).length, [routines]);
    const trackedWeeks = weeks.length;
    const completedMissions = useMemo(() => missions.filter((m) => m.completed).length, [missions]);

    const joinLabel = formatJoinDate(user?.createdAt);

    /* ---------- Profil ma'lumotlarini tahrirlash ---------- */
    // Dashboard'dagi bilan bir xil "render vaqtida sinxronlash" patterni:
    // foydalanuvchi context'dan yangilanganda forma qayta to'ldiriladi, lekin
    // inputga yozayotgan matn har render'da ustidan yozib yuborilmaydi.
    const identitySignature = `${user?.ism || ""}::${user?.email || ""}`;
    const [syncedIdentity, setSyncedIdentity] = useState(identitySignature);
    const [profileForm, setProfileForm] = useState({ ism: user?.ism || "", email: user?.email || "" });
    if (identitySignature !== syncedIdentity) {
        setSyncedIdentity(identitySignature);
        setProfileForm({ ism: user?.ism || "", email: user?.email || "" });
    }

    const [profileError, setProfileError] = useState(null);
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [profileSubmitting, setProfileSubmitting] = useState(false);

    const saveProfile = async (e) => {
        e.preventDefault();
        if (!profileForm.ism.trim()) {
            setProfileError("Ismingizni kiriting");
            return;
        }
        if (!profileForm.email.trim()) {
            setProfileError("Email kiriting");
            return;
        }
        setProfileSubmitting(true);
        setProfileError(null);
        setProfileSuccess(false);
        try {
            await updateProfile({ ism: profileForm.ism.trim(), email: profileForm.email.trim() });
            setProfileSuccess(true);
            setTimeout(() => setProfileSuccess(false), 3000);
        } catch (err) {
            setProfileError(err.response?.data?.message || err.message || "Profilni yangilashda xatolik");
        } finally {
            setProfileSubmitting(false);
        }
    };

    /* ---------- Parolni almashtirish ---------- */
    const [passForm, setPassForm] = useState({ current: "", next: "", confirm: "" });
    const [passError, setPassError] = useState(null);
    const [passSuccess, setPassSuccess] = useState(false);
    const [passSubmitting, setPassSubmitting] = useState(false);

    const savePassword = async (e) => {
        e.preventDefault();
        if (passForm.current !== user?.parol) {
            setPassError("Joriy parol noto'g'ri");
            return;
        }
        if (passForm.next.length < 4) {
            setPassError("Yangi parol kamida 4 belgidan iborat bo'lsin");
            return;
        }
        if (passForm.next !== passForm.confirm) {
            setPassError("Yangi parollar mos kelmadi");
            return;
        }
        setPassSubmitting(true);
        setPassError(null);
        setPassSuccess(false);
        try {
            await updateProfile({ parol: passForm.next, parol_check: passForm.next });
            setPassSuccess(true);
            setPassForm({ current: "", next: "", confirm: "" });
            setTimeout(() => setPassSuccess(false), 3000);
        } catch (err) {
            setPassError(err.response?.data?.message || err.message || "Parolni yangilashda xatolik");
        } finally {
            setPassSubmitting(false);
        }
    };

    return (
        <Wrapper>
            <Inner>
                <HeaderRow>
                    <Eyebrow>
                        <Compass size={12} /> Ekspeditsiyachi
                    </Eyebrow>
                    <Title>Profile</Title>
                    <Subtitle>Shaxsiy ma'lumotlaringiz va TartibOS'dagi safar tarixi.</Subtitle>
                </HeaderRow>

                <IdentityCard>
                    <AvatarCircle>{getInitials(user?.ism)}</AvatarCircle>
                    <IdentityBody>
                        <UserName>{user?.ism || "Foydalanuvchi"}</UserName>
                        <UserEmail>{user?.email}</UserEmail>
                        {joinLabel && <UserSince>{joinLabel} kuni qo'shilgan</UserSince>}
                    </IdentityBody>
                </IdentityCard>

                <StatGrid>
                    <StatCard>
                        <StatLabel>Faol odatlar</StatLabel>
                        <StatValue>{totalHabits}</StatValue>
                    </StatCard>
                    <StatCard>
                        <StatLabel>Kuzatilgan haftalar</StatLabel>
                        <StatValue>{trackedWeeks}</StatValue>
                    </StatCard>
                    <StatCard>
                        <StatLabel>Bajarilgan missiya</StatLabel>
                        <StatValue>{completedMissions}</StatValue>
                    </StatCard>
                </StatGrid>

                <SectionCard>
                    <SectionHead>
                        <SectionTitle>
                            <UserRound size={16} color="#E7A94C" />
                            Shaxsiy ma'lumotlar
                        </SectionTitle>
                        <SectionCaption>Ism va email manzilingizni yangilang</SectionCaption>
                    </SectionHead>

                    <form onSubmit={saveProfile}>
                        <FormGrid>
                            <Field>
                                <FieldLabel>Ism</FieldLabel>
                                <Input
                                    value={profileForm.ism}
                                    onChange={(e) => setProfileForm((f) => ({ ...f, ism: e.target.value }))}
                                    placeholder="Ismingiz"
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Email</FieldLabel>
                                <Input
                                    type="email"
                                    value={profileForm.email}
                                    onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
                                    placeholder="email@misol.com"
                                />
                            </Field>
                        </FormGrid>
                        {profileError && <FieldError>{profileError}</FieldError>}
                        {profileSuccess && <SuccessBanner>Profil muvaffaqiyatli yangilandi</SuccessBanner>}
                        <SaveBtn type="submit" $disabled={profileSubmitting} disabled={profileSubmitting}>
                            {profileSubmitting ? "Saqlanmoqda..." : "Saqlash"}
                        </SaveBtn>
                    </form>
                </SectionCard>

                <SectionCard>
                    <SectionHead>
                        <SectionTitle>
                            <KeyRound size={16} color="#E7A94C" />
                            Parolni almashtirish
                        </SectionTitle>
                        <SectionCaption>Xavfsizlik uchun joriy parolingizni tasdiqlang</SectionCaption>
                    </SectionHead>

                    <form onSubmit={savePassword}>
                        <FormGrid>
                            <Field>
                                <FieldLabel>Joriy parol</FieldLabel>
                                <Input
                                    type="password"
                                    value={passForm.current}
                                    onChange={(e) => setPassForm((f) => ({ ...f, current: e.target.value }))}
                                    placeholder="••••••••"
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Yangi parol</FieldLabel>
                                <Input
                                    type="password"
                                    value={passForm.next}
                                    onChange={(e) => setPassForm((f) => ({ ...f, next: e.target.value }))}
                                    placeholder="••••••••"
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Yangi parolni tasdiqlang</FieldLabel>
                                <Input
                                    type="password"
                                    value={passForm.confirm}
                                    onChange={(e) => setPassForm((f) => ({ ...f, confirm: e.target.value }))}
                                    placeholder="••••••••"
                                />
                            </Field>
                        </FormGrid>
                        {passError && <FieldError>{passError}</FieldError>}
                        {passSuccess && <SuccessBanner>Parol muvaffaqiyatli yangilandi</SuccessBanner>}
                        <SaveBtn type="submit" $disabled={passSubmitting} disabled={passSubmitting}>
                            {passSubmitting ? "Saqlanmoqda..." : "Parolni yangilash"}
                        </SaveBtn>
                    </form>
                </SectionCard>

                <DangerZone>
                    <DangerText>
                        Tizimdan chiqsangiz, qayta kirish uchun email va parolingiz kerak bo'ladi.
                    </DangerText>
                    <LogoutBtn type="button" onClick={logout}>
                        <LogOut size={14} /> Chiqish
                    </LogoutBtn>
                </DangerZone>
            </Inner>
        </Wrapper>
    );
};

export default Profile;