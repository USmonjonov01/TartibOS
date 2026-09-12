import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Mountain, Sparkles, X } from "lucide-react";
import { useGoals } from "../../context/goals";
import MountainScene from "./MountainScene";
import {
    Wrapper,
    HeaderRow,
    Title,
    Subtitle,
    AddGoalButton,
    EmptyState,
    CarouselViewport,
    CarouselTrack,
    CarouselSlide,
    CarouselNav,
    NavArrow,
    Dots,
    Dot,
    ModalOverlay,
    ModalBox,
    ModalPad,
    ModalTitle,
    FieldLabel,
    TextInput,
    ModalActions,
    SecondaryButton,
    PrimaryButton,
    AiButton,
    ErrorText,
    GeneratedList,
    GeneratedRow,
    GeneratedRowText,
    GeneratedRowStage,
    RemoveStepBtn,
} from "./style";

function Roadmap() {
    const { goals, fetchGoals, createGoal, addStep, toggleStep, generateSteps } = useGoals();
    const [activeIndex, setActiveIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [generatedSteps, setGeneratedSteps] = useState(null); // null = hali generatsiya qilinmagan
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchGoals().catch(() => {});
    }, [fetchGoals]);

    useEffect(() => {
        if (activeIndex > goals.length - 1) {
            setActiveIndex(Math.max(0, goals.length - 1));
        }
    }, [goals, activeIndex]);

    const openModal = () => {
        setShowModal(true);
        setNewTitle("");
        setGeneratedSteps(null);
        setAiError(null);
    };

    const handleGenerate = async () => {
        const title = newTitle.trim();
        if (!title) return;
        setAiLoading(true);
        setAiError(null);
        try {
            const steps = await generateSteps(title);
            setGeneratedSteps(steps);
        } catch {
            setAiError(
                "AI hozircha bosqich taklif qila olmadi. \"Bo'sh Goal\" sifatida yaratib, bosqichlarni o'zingiz qo'shishingiz mumkin."
            );
            setGeneratedSteps(null);
        } finally {
            setAiLoading(false);
        }
    };

    const removeGeneratedStep = (index) => {
        setGeneratedSteps((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCreateGoal = async () => {
        const title = newTitle.trim();
        if (!title) return;
        setSubmitting(true);
        try {
            await createGoal({ title, steps: generatedSteps?.length ? generatedSteps : undefined });
            setShowModal(false);
            setActiveIndex(goals.length); // yangi Goal oxirida qo'shiladi
        } finally {
            setSubmitting(false);
        }
    };

    const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
    const goNext = () => setActiveIndex((i) => Math.min(goals.length - 1, i + 1));

    return (
        <Wrapper>
            <HeaderRow>
                <div>
                    <Title>Yo'l xaritasi</Title>
                    <Subtitle>Har bir maqsad — o'z tog'i. Cho'qqiga qadam-baqadam yaqinlashing.</Subtitle>
                </div>
                <AddGoalButton onClick={openModal}>
                    <Plus size={15} /> Yangi maqsad
                </AddGoalButton>
            </HeaderRow>

            {goals.length === 0 ? (
                <EmptyState>
                    <Mountain size={28} style={{ marginBottom: 10, opacity: 0.5 }} />
                    <div>Hali maqsadingiz yo'q. Birinchi tog'ingizni tanlang.</div>
                </EmptyState>
            ) : (
                <>
                    <CarouselViewport>
                        <CarouselTrack $index={activeIndex}>
                            {goals.map((goal) => (
                                <CarouselSlide key={goal.id}>
                                    <MountainScene goal={goal} onToggleStep={toggleStep} onAddStep={addStep} />
                                </CarouselSlide>
                            ))}
                        </CarouselTrack>
                    </CarouselViewport>

                    {goals.length > 1 && (
                        <CarouselNav>
                            <NavArrow onClick={goPrev} disabled={activeIndex === 0}>
                                <ChevronLeft size={16} />
                            </NavArrow>
                            <Dots>
                                {goals.map((g, i) => (
                                    <Dot key={g.id} $active={i === activeIndex} onClick={() => setActiveIndex(i)} />
                                ))}
                            </Dots>
                            <NavArrow onClick={goNext} disabled={activeIndex === goals.length - 1}>
                                <ChevronRight size={16} />
                            </NavArrow>
                        </CarouselNav>
                    )}
                </>
            )}

            {showModal && (
                <ModalOverlay onClick={() => setShowModal(false)}>
                    <ModalBox onClick={(e) => e.stopPropagation()}>
                        <ModalPad>
                            <ModalTitle>Yangi maqsad</ModalTitle>

                            <FieldLabel>Maqsad nomi</FieldLabel>
                            <TextInput
                                placeholder="Masalan: Gitara chalishni o'rganish"
                                value={newTitle}
                                onChange={(e) => {
                                    setNewTitle(e.target.value);
                                    setGeneratedSteps(null);
                                    setAiError(null);
                                }}
                                autoFocus
                            />

                            {generatedSteps === null && (
                                <AiButton type="button" disabled={!newTitle.trim() || aiLoading} onClick={handleGenerate}>
                                    <Sparkles size={14} />
                                    {aiLoading ? "Generatsiya qilinmoqda..." : "AI'dan bosqichlar taklif olish"}
                                </AiButton>
                            )}

                            {aiError && <ErrorText>{aiError}</ErrorText>}

                            {generatedSteps && generatedSteps.length > 0 && (
                                <>
                                    <FieldLabel style={{ marginTop: 16 }}>
                                        Taklif qilingan bosqichlar — kerak bo'lmaganini olib tashlashingiz mumkin
                                    </FieldLabel>
                                    <GeneratedList>
                                        {generatedSteps.map((s, i) => (
                                            <GeneratedRow key={i}>
                                                <GeneratedRowText>
                                                    {s.title}
                                                    {s.stageLabel && <GeneratedRowStage>{s.stageLabel}</GeneratedRowStage>}
                                                </GeneratedRowText>
                                                <RemoveStepBtn type="button" onClick={() => removeGeneratedStep(i)}>
                                                    <X size={14} />
                                                </RemoveStepBtn>
                                            </GeneratedRow>
                                        ))}
                                    </GeneratedList>
                                </>
                            )}

                            <ModalActions>
                                <SecondaryButton type="button" onClick={() => setShowModal(false)}>
                                    Bekor qilish
                                </SecondaryButton>
                                <PrimaryButton
                                    type="button"
                                    disabled={!newTitle.trim() || submitting || aiLoading}
                                    onClick={handleCreateGoal}
                                >
                                    {generatedSteps?.length ? "Shu bosqichlar bilan yaratish" : "Bo'sh Goal yaratish"}
                                </PrimaryButton>
                            </ModalActions>
                        </ModalPad>
                    </ModalBox>
                </ModalOverlay>
            )}
        </Wrapper>
    );
}

export default Roadmap;
