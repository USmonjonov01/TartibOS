import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Plus, Milestone, Sparkles, X, Archive } from "lucide-react";
import { useGoals } from "../../context/goals";
import StaircaseScene from "./StaircaseScene";
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
    ArchivedSection,
    ArchivedToggle,
    ArchivedList,
    ArchivedRow,
    ArchivedInfo,
    ArchivedTitle,
    ArchivedMeta,
    SmallGhostButton,
    SmallDangerButton,
} from "./style";

function Roadmap() {
    const {
        goals,
        fetchGoals,
        createGoal,
        updateGoal,
        deleteGoal,
        addStep,
        updateStep,
        deleteStep,
        toggleStep,
        generateSteps,
    } = useGoals();
    const [activeIndex, setActiveIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [generatedSteps, setGeneratedSteps] = useState(null); // null = hali generatsiya qilinmagan
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [showArchived, setShowArchived] = useState(false);
    const [confirmTarget, setConfirmTarget] = useState(null); // { type: 'goal'|'step', goal, step? }

    const activeGoals = goals.filter((g) => g.status !== "archived");
    const archivedGoals = goals.filter((g) => g.status === "archived");

    useEffect(() => {
        fetchGoals().catch(() => {});
    }, [fetchGoals]);

    useEffect(() => {
        if (activeIndex > activeGoals.length - 1) {
            setActiveIndex(Math.max(0, activeGoals.length - 1));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeGoals.length, activeIndex]);

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
            setActiveIndex(activeGoals.length); // yangi Goal oxirida qo'shiladi
        } finally {
            setSubmitting(false);
        }
    };

    const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
    const goNext = () => setActiveIndex((i) => Math.min(activeGoals.length - 1, i + 1));

    const handleRenameGoal = (goalId, title) => updateGoal(goalId, { title });
    const handleArchiveGoal = (goalId, status) => updateGoal(goalId, { status });

    const requestDeleteGoal = (goal) => setConfirmTarget({ type: "goal", goal });
    const requestDeleteStep = (goalId, step) => setConfirmTarget({ type: "step", goalId, step });

    const confirmDelete = async () => {
        if (!confirmTarget) return;
        if (confirmTarget.type === "goal") {
            await deleteGoal(confirmTarget.goal.id);
        } else {
            await deleteStep(confirmTarget.goalId, confirmTarget.step.id);
        }
        setConfirmTarget(null);
    };

    return (
        <Wrapper>
            <HeaderRow>
                <div>
                    <Title>Yo'l xaritasi</Title>
                    <Subtitle>Har bir maqsad — o'z zinapoyasi. Bosqichma-bosqich yuqoriga chiqing.</Subtitle>
                </div>
                <AddGoalButton onClick={openModal}>
                    <Plus size={15} /> Yangi maqsad
                </AddGoalButton>
            </HeaderRow>

            {activeGoals.length === 0 ? (
                <EmptyState>
                    <Milestone size={28} style={{ marginBottom: 10, opacity: 0.5 }} />
                    <div>Hali maqsadingiz yo'q. Birinchi zinapoyangizni quring.</div>
                </EmptyState>
            ) : (
                <>
                    <CarouselViewport>
                        <CarouselTrack $index={activeIndex}>
                            {activeGoals.map((goal) => (
                                <CarouselSlide key={goal.id}>
                                    <StaircaseScene
                                        goal={goal}
                                        onToggleStep={toggleStep}
                                        onAddStep={addStep}
                                        onRenameGoal={handleRenameGoal}
                                        onArchiveGoal={handleArchiveGoal}
                                        onRequestDeleteGoal={requestDeleteGoal}
                                        onUpdateStep={updateStep}
                                        onRequestDeleteStep={requestDeleteStep}
                                    />
                                </CarouselSlide>
                            ))}
                        </CarouselTrack>
                    </CarouselViewport>

                    {activeGoals.length > 1 && (
                        <CarouselNav>
                            <NavArrow onClick={goPrev} disabled={activeIndex === 0}>
                                <ChevronLeft size={16} />
                            </NavArrow>
                            <Dots>
                                {activeGoals.map((g, i) => (
                                    <Dot key={g.id} $active={i === activeIndex} onClick={() => setActiveIndex(i)} />
                                ))}
                            </Dots>
                            <NavArrow onClick={goNext} disabled={activeIndex === activeGoals.length - 1}>
                                <ChevronRight size={16} />
                            </NavArrow>
                        </CarouselNav>
                    )}
                </>
            )}

            {archivedGoals.length > 0 && (
                <ArchivedSection>
                    <ArchivedToggle onClick={() => setShowArchived((v) => !v)}>
                        <Archive size={14} />
                        Arxivlangan maqsadlar ({archivedGoals.length})
                        <ChevronDown
                            size={14}
                            style={{ transform: showArchived ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
                        />
                    </ArchivedToggle>
                    {showArchived && (
                        <ArchivedList>
                            {archivedGoals.map((g) => {
                                const done = (g.steps || []).filter((s) => s.completed).length;
                                const total = (g.steps || []).length;
                                return (
                                    <ArchivedRow key={g.id}>
                                        <ArchivedInfo>
                                            <ArchivedTitle>{g.title}</ArchivedTitle>
                                            <ArchivedMeta>
                                                {done}/{total} bosqich bajarilgan
                                            </ArchivedMeta>
                                        </ArchivedInfo>
                                        <SmallGhostButton onClick={() => handleArchiveGoal(g.id, "active")}>
                                            Faollashtirish
                                        </SmallGhostButton>
                                        <SmallDangerButton onClick={() => requestDeleteGoal(g)}>
                                            O'chirish
                                        </SmallDangerButton>
                                    </ArchivedRow>
                                );
                            })}
                        </ArchivedList>
                    )}
                </ArchivedSection>
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

            {confirmTarget && (
                <ModalOverlay onClick={() => setConfirmTarget(null)}>
                    <ModalBox onClick={(e) => e.stopPropagation()}>
                        <ModalPad>
                            <ModalTitle>
                                {confirmTarget.type === "goal" ? "Maqsadni o'chirish" : "Bosqichni o'chirish"}
                            </ModalTitle>
                            <div style={{ fontSize: 13.5, color: "inherit", opacity: 0.85 }}>
                                {confirmTarget.type === "goal" ? (
                                    <>
                                        <strong>{confirmTarget.goal.title}</strong> maqsadi va uning barcha bosqichlari
                                        butunlay o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi.
                                    </>
                                ) : (
                                    <>
                                        <strong>{confirmTarget.step.title}</strong> bosqichi o'chiriladi. Bu amalni ortga
                                        qaytarib bo'lmaydi.
                                    </>
                                )}
                            </div>
                            <ModalActions>
                                <SecondaryButton type="button" onClick={() => setConfirmTarget(null)}>
                                    Bekor qilish
                                </SecondaryButton>
                                <SmallDangerButton style={{ flex: 1, padding: "10px 16px" }} onClick={confirmDelete}>
                                    Ha, o'chirish
                                </SmallDangerButton>
                            </ModalActions>
                        </ModalPad>
                    </ModalBox>
                </ModalOverlay>
            )}
        </Wrapper>
    );
}

export default Roadmap;
