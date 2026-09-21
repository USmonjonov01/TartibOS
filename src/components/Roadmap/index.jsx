import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ChevronDown, Plus, Milestone, Archive } from "lucide-react";
import { useGoals } from "../../context/goals";
import StaircaseScene from "./StaircaseScene";
import GoalWizard from "../GoalWizard";
import { WideModalBox } from "../GoalWizard/style";
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
    ModalActions,
    SecondaryButton,
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
        updateGoal,
        deleteGoal,
        addStep,
        updateStep,
        deleteStep,
        toggleStep,
    } = useGoals();
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
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

    const openModal = () => setShowModal(true);

    // Wizard tugaganda: yangi maqsadga o'tamiz; foydalanuvchi kun tartibini
    // ko'rishni tanlagan bo'lsa (to), o'sha sahifaga yo'naltiramiz.
    const handleWizardFinish = ({ goal, to }) => {
        setShowModal(false);
        const idx = activeGoals.findIndex((g) => g.id === goal?.id);
        setActiveIndex(idx >= 0 ? idx : Math.max(0, activeGoals.length - 1));
        if (to) navigate(to);
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
                    <WideModalBox onClick={(e) => e.stopPropagation()}>
                        <GoalWizard
                            skipLabel="Bekor qilish"
                            onSkip={() => setShowModal(false)}
                            onFinish={handleWizardFinish}
                        />
                    </WideModalBox>
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
