import { useEffect, useState } from "react";
import { Sparkles, X, Check, ArrowRight, RefreshCw } from "lucide-react";
import { useGoals } from "../../context/goals";
import { useRoutine } from "../../context/routine";
import { DAY_ORDER, DAY_LABELS_UZ } from "../../utils/date";
import {
    Shell,
    Stepper,
    StepperItem,
    StepperDot,
    StepperLine,
    Heading,
    Lead,
    Label,
    GoalInput,
    DescriptionLabel,
    DescriptionTextarea,
    ChipRow,
    Chip,
    Actions,
    PrimaryButton,
    SecondaryButton,
    GhostLink,
    ErrorNote,
    ThinkingCard,
    ThinkingIcon,
    ThinkingText,
    ThinkingHint,
    ThinkingBar,
    CountBadge,
    StepsList,
    StepItem,
    StepNumber,
    StepBody,
    StepStage,
    RemoveButton,
    Celebrate,
    RoutineList,
    RoutineItem,
    RoutineEmoji,
    RoutineMain,
    RoutineTitle,
    RoutineMeta,
    TimeTag,
    DayTag,
    Note,
} from "./style";

// Foydalanuvchiga ko'rsatiladigan 3 ta bosqich (indikator uchun)
const STAGES = ["Maqsad", "Yo'l xaritasi", "Kun tartibi"];
const PHASE_STAGE = { goal: 0, preview: 1, ask: 2, routineLoading: 2, done: 2 };

const GOAL_EXAMPLES = [
    "Fullstack developer bo'lish",
    "IELTS'dan 7.0 olish",
    "Gitara chalishni o'rganish",
    "Yarim marafon yugurish",
];

const HOURS_OPTIONS = [
    { value: 1, label: "1 soat" },
    { value: 2, label: "2 soat" },
    { value: 3, label: "3 soat" },
    { value: 4, label: "4+ soat" },
];

const ROADMAP_MESSAGES = [
    "Maqsadingiz tahlil qilinmoqda...",
    "Boshlang'ich nuqta aniqlanmoqda...",
    "Bosqichlar ketma-ketligi tuzilmoqda...",
    "Har bir bosqich aniqlashtirilmoqda...",
];

const ROUTINE_MESSAGES = [
    "Yo'l xaritangiz o'rganilmoqda...",
    "Kuningizga mos vaqtlar tanlanmoqda...",
    "Odatlar bosqichlarga bog'lanmoqda...",
    "Haftalik reja tuzilmoqda...",
];

// AI ishlayotgan paytdagi kutish holati — xabarlar navbat bilan almashib turadi,
// shunda foydalanuvchi jarayon "qotib qolmaganini" ko'radi.
function Thinking({ messages, hint }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), 2400);
        return () => clearInterval(id);
    }, [messages.length]);

    return (
        <ThinkingCard>
            <ThinkingIcon>
                <Sparkles size={26} />
            </ThinkingIcon>
            <ThinkingText>{messages[index]}</ThinkingText>
            <ThinkingHint>{hint}</ThinkingHint>
            <ThinkingBar />
        </ThinkingCard>
    );
}

const formatDays = (days) => {
    if (!days || days.length === 0 || days.length === 7) return null; // "har kuni"
    return DAY_ORDER.map((key, i) => (days.includes(key) ? DAY_LABELS_UZ[i] : null)).filter(Boolean);
};

// Yangi maqsad oqimi:
//   1) maqsad nomi  →  2) AI 15–20 bosqichli yo'l xaritasi (preview, tahrirlanadi)
//   →  3) "kun tartibini tuzishga ruhsat bering" tasdig'i  →  4) AI kun tartibini
//   tuzib, saqlaydi va natijani ko'rsatadi.
//
// Ham yangi foydalanuvchi onboarding'ida (Onboarding), ham Roadmap sahifasidagi
// "Yangi maqsad" modalida ishlatiladi. Tugaganda onFinish({ goal, routines, to })
// chaqiriladi: `to` — foydalanuvchi tanlagan yo'nalish ("/dashboard" | "/routine")
// yoki null (kun tartibisiz yakunlangan bo'lsa).
function GoalWizard({ onFinish, onSkip, skipLabel = "Keyinroq" }) {
    const { generateSteps, createGoal, generateRoutine } = useGoals();
    const { fetchRoutines } = useRoutine();

    const [phase, setPhase] = useState("goal");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [steps, setSteps] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState(null);
    const [goal, setGoal] = useState(null);
    const [hours, setHours] = useState(2);
    const [routines, setRoutines] = useState([]);

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    const handleGenerate = async () => {
        if (trimmedTitle.length < 2 || aiLoading) return;
        setAiLoading(true);
        setError(null);
        try {
            const result = await generateSteps(trimmedTitle, trimmedDescription || undefined);
            if (!result.length) throw new Error("empty");
            setSteps(result);
            setPhase("preview");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "AI hozircha yo'l xaritasi tuza olmadi. Qayta urinib ko'ring yoki bo'sh maqsad sifatida davom eting."
            );
        } finally {
            setAiLoading(false);
        }
    };

    const removeStep = (index) => setSteps((prev) => prev.filter((_, i) => i !== index));

    // empty=true — AI ishlamaganda: bosqichsiz maqsad yaratib, oqimni yakunlaydi
    const handleCreate = async ({ empty = false } = {}) => {
        if (creating) return;
        setCreating(true);
        setError(null);
        try {
            const created = await createGoal({
                title: trimmedTitle,
                description: trimmedDescription || undefined,
                steps: empty ? undefined : steps,
            });
            setGoal(created);
            if (empty) {
                onFinish?.({ goal: created, routines: [], to: null });
                return;
            }
            setPhase("ask");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Maqsadni saqlashda xatolik yuz berdi.");
        } finally {
            setCreating(false);
        }
    };

    const handleRoutine = async () => {
        setPhase("routineLoading");
        setError(null);
        try {
            const created = await generateRoutine(goal.id, { dailyHours: hours });
            setRoutines(created);
            fetchRoutines().catch(() => {}); // Dashboard / Kun tartibim yangi odatlarni ko'rsin
            setPhase("done");
        } catch (err) {
            setError(err.response?.data?.message || "Kun tartibini tuzib bo'lmadi. Qayta urinib ko'ring.");
            setPhase("ask");
        }
    };

    const finish = (to) => onFinish?.({ goal, routines, to });

    const stageIndex = PHASE_STAGE[phase];

    return (
        <Shell>
            <Stepper>
                {STAGES.map((label, i) => (
                    <StepperItem key={label} $active={i === stageIndex}>
                        {i > 0 && <StepperLine />}
                        <StepperDot $active={i === stageIndex} $done={i < stageIndex}>
                            {i < stageIndex ? <Check size={12} /> : i + 1}
                        </StepperDot>
                        {label}
                    </StepperItem>
                ))}
            </Stepper>

            {/* ---------- 1. Maqsad ---------- */}
            {phase === "goal" && (
                <>
                    <Heading>Maqsadingiz nima?</Heading>
                    <Lead>
                        Bitta jumla yozing — men sizga hozirgi nuqtangizdan maqsadga yetguncha bo'lgan
                        boshidan oxirigacha aniq yo'l xaritasini tuzib beraman.
                    </Lead>

                    {aiLoading ? (
                        <Thinking messages={ROADMAP_MESSAGES} hint="Bu 10–20 soniya vaqt olishi mumkin" />
                    ) : (
                        <>
                            <GoalInput
                                autoFocus
                                placeholder="Masalan: Fullstack developer bo'lish"
                                value={title}
                                maxLength={150}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    setError(null);
                                }}
                                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                            />

                            <DescriptionLabel htmlFor="goal-description">
                                Qo'shimcha ma'lumot (ixtiyoriy) — hozirgi holatingiz qanday?
                            </DescriptionLabel>
                            <DescriptionTextarea
                                id="goal-description"
                                placeholder="Masalan: Hozir junior frontend developerman, React bilan ishlayman, backend'ni umuman bilmayman. Kuniga kechqurun 2 soat vaqtim bor."
                                value={description}
                                maxLength={600}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            <ChipRow>
                                {GOAL_EXAMPLES.map((example) => (
                                    <Chip
                                        key={example}
                                        type="button"
                                        $active={title === example}
                                        onClick={() => {
                                            setTitle(example);
                                            setError(null);
                                        }}
                                    >
                                        {example}
                                    </Chip>
                                ))}
                            </ChipRow>

                            {error && <ErrorNote>{error}</ErrorNote>}

                            <Actions>
                                <PrimaryButton type="button" disabled={trimmedTitle.length < 2} onClick={handleGenerate}>
                                    <Sparkles size={16} />
                                    {error ? "Qayta urinish" : "Yo'l xaritasini tuzish"}
                                </PrimaryButton>
                                {error && (
                                    <SecondaryButton
                                        type="button"
                                        disabled={creating || trimmedTitle.length < 2}
                                        onClick={() => handleCreate({ empty: true })}
                                    >
                                        Bo'sh maqsad yaratish
                                    </SecondaryButton>
                                )}
                            </Actions>
                        </>
                    )}

                    {onSkip && !aiLoading && <GhostLink onClick={onSkip}>{skipLabel}</GhostLink>}
                </>
            )}

            {/* ---------- 2. Yo'l xaritasi preview ---------- */}
            {phase === "preview" && (
                <>
                    <Heading>
                        Yo'lingiz tayyor
                        <CountBadge>{steps.length} bosqich</CountBadge>
                    </Heading>
                    <Lead>
                        <strong>{trimmedTitle}</strong> maqsadiga boshidan oxirigacha yo'l. Kerak bo'lmagan
                        bosqichni olib tashlashingiz mumkin — keyinroq Yo'l xaritasi sahifasida ham tahrirlay
                        olasiz.
                    </Lead>

                    {aiLoading ? (
                        <Thinking messages={ROADMAP_MESSAGES} hint="Yangi variant tuzilmoqda..." />
                    ) : (
                        <StepsList>
                            {steps.map((s, i) => (
                                <StepItem key={`${i}-${s.title}`}>
                                    <StepNumber>{i + 1}</StepNumber>
                                    <StepBody>
                                        {s.title}
                                        {s.stageLabel && <StepStage>{s.stageLabel}</StepStage>}
                                    </StepBody>
                                    <RemoveButton
                                        type="button"
                                        title="Bosqichni olib tashlash"
                                        onClick={() => removeStep(i)}
                                    >
                                        <X size={14} />
                                    </RemoveButton>
                                </StepItem>
                            ))}
                        </StepsList>
                    )}

                    {error && <ErrorNote>{error}</ErrorNote>}

                    <Actions>
                        <SecondaryButton type="button" disabled={aiLoading || creating} onClick={handleGenerate}>
                            <RefreshCw size={15} /> Boshqa variant
                        </SecondaryButton>
                        <PrimaryButton
                            type="button"
                            disabled={aiLoading || creating || steps.length === 0}
                            onClick={() => handleCreate()}
                        >
                            {creating ? "Saqlanmoqda..." : "Shu yo'l bilan boshlash"}
                            {!creating && <ArrowRight size={16} />}
                        </PrimaryButton>
                    </Actions>
                    <GhostLink
                        onClick={() => {
                            setPhase("goal");
                            setError(null);
                        }}
                    >
                        Maqsadni o'zgartirish
                    </GhostLink>
                </>
            )}

            {/* ---------- 3. Kun tartibi uchun ruxsat ---------- */}
            {phase === "ask" && (
                <>
                    <Celebrate>
                        <Check size={26} />
                    </Celebrate>
                    <Heading>Yo'l xaritasi yaratildi!</Heading>
                    <Lead>
                        Endi navbat sizning maqsadingizga mos kun tartibini tuzishda. Ruxsat bersangiz, men uni
                        siz uchun maxsus tayyorlayman: har bir odat, uning vaqti va kunlik reja yo'l
                        xaritangizdagi bosqichlarga bog'lanadi.
                    </Lead>

                    <Label>Kuniga maqsadingiz uchun qancha vaqt ajrata olasiz?</Label>
                    <ChipRow style={{ marginTop: 0 }}>
                        {HOURS_OPTIONS.map((opt) => (
                            <Chip
                                key={opt.value}
                                type="button"
                                $active={hours === opt.value}
                                onClick={() => setHours(opt.value)}
                            >
                                {opt.label}
                            </Chip>
                        ))}
                    </ChipRow>

                    <Note>
                        Tayyor bo'lgach, odatlarning vaqtini o'zgartirishingiz yoki keraksizini olib tashlashingiz
                        mumkin — hammasi o'zingizning nazoratingizda.
                    </Note>

                    {error && <ErrorNote>{error}</ErrorNote>}

                    <Actions>
                        <SecondaryButton type="button" onClick={() => finish(null)}>
                            Hozircha yo'q
                        </SecondaryButton>
                        <PrimaryButton type="button" onClick={handleRoutine}>
                            <Sparkles size={16} />
                            {error ? "Qayta urinish" : "Ha, tuzib bering"}
                        </PrimaryButton>
                    </Actions>
                </>
            )}

            {phase === "routineLoading" && (
                <>
                    <Heading>Kun tartibingiz tuzilmoqda</Heading>
                    <Lead>Maqsad, bosqichlar va bo'sh vaqtingiz asosida shaxsiy reja tayyorlanmoqda.</Lead>
                    <Thinking messages={ROUTINE_MESSAGES} hint="Bu 10–20 soniya vaqt olishi mumkin" />
                </>
            )}

            {/* ---------- 4. Natija ---------- */}
            {phase === "done" && (
                <>
                    <Celebrate>
                        <Check size={26} />
                    </Celebrate>
                    <Heading>Kun tartibingiz tayyor!</Heading>
                    <Lead>
                        {routines.length} ta odat qo'shildi. Ular Bosh sahifa va Kun tartibim sahifasida
                        ko'rinadi.
                    </Lead>

                    <RoutineList>
                        {routines.map((r) => {
                            const days = formatDays(r.days);
                            return (
                                <RoutineItem key={r.id}>
                                    <RoutineEmoji>{r.icon || "✦"}</RoutineEmoji>
                                    <RoutineMain>
                                        <RoutineTitle>{r.title}</RoutineTitle>
                                        <RoutineMeta>
                                            <TimeTag>
                                                {r.start}–{r.end}
                                            </TimeTag>
                                            {days ? days.map((d) => <DayTag key={d}>{d}</DayTag>) : <DayTag>Har kuni</DayTag>}
                                        </RoutineMeta>
                                    </RoutineMain>
                                </RoutineItem>
                            );
                        })}
                    </RoutineList>

                    <Note>Odat vaqtlarini va keraksizlarini Kun tartibim sahifasida istalgan payt tahrirlashingiz mumkin.</Note>

                    <Actions>
                        <SecondaryButton type="button" onClick={() => finish("/routine")}>
                            Kun tartibimni ko'rish
                        </SecondaryButton>
                        <PrimaryButton type="button" onClick={() => finish("/dashboard")}>
                            Bosh sahifaga o'tish <ArrowRight size={16} />
                        </PrimaryButton>
                    </Actions>
                </>
            )}
        </Shell>
    );
}

export default GoalWizard;