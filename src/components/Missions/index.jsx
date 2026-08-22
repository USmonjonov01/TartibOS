import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Plus,
    CheckCircle2,
    Circle,
    Clock,
    Calendar,
    X,
    Ban,
    Trash2,
    AlertCircle,
} from "lucide-react";
import { useUser } from "../../context/users";
import { useNotifications } from "../../context/notifications";
import { missionApi } from "../../axios";
import { getDateStr } from "../../utils/date";
import {
    Wrapper,
    HeaderRow,
    Title,
    Subtitle,
    AddButton,
    TabsRow,
    TabButton,
    TabCount,
    ProgressCard,
    ProgressTrack,
    ProgressFill,
    ProgressLabel,
    List,
    MissionRow,
    CheckButton,
    MissionBody,
    MissionTitle,
    MissionNote,
    MissionMeta,
    PriorityBadge,
    MetaTag,
    RemoveButton,
    CancelButton,
    RowActions,
    EmptyState,
    EmptyIcon,
    EmptyTitle,
    EmptySub,
    StatusText,
    ErrorBanner,
    ModalOverlay,
    ModalBox,
    ModalPad,
    ModalHeader,
    ModalTitle,
    CloseButton,
    FormStack,
    FieldGrid,
    Field,
    FieldLabel,
    Input,
    Select,
    Textarea,
    FieldError,
    ModalActions,
    PrimaryButton,
    SecondaryButton,
    colors,
} from "./style";

const SCOPES = ["bugun", "kelgusi", "haftalik"];
const SCOPE_LABELS = { bugun: "Bugun", kelgusi: "Kelgusi", haftalik: "Haftalik" };

const PRIORITY_LABELS = { yuqori: "Yuqori", ortacha: "O'rtacha", past: "Past" };
const PRIORITY_ORDER = { yuqori: 0, ortacha: 1, past: 2 };
const PRIORITY_COLORS = {
    yuqori: { color: colors.danger, bg: colors.dangerLight },
    ortacha: { color: colors.warning, bg: colors.warningLight },
    past: { color: colors.success, bg: colors.successLight },
};

const getMissionScope = (mission, todayStr) => {
    if (mission.scope && SCOPES.includes(mission.scope)) return mission.scope;
    if (!mission.date) return "bugun";
    return mission.date > todayStr ? "kelgusi" : "bugun";
};

const DIFFICULTY_OPTIONS = [1, 2, 3, 4, 5];

const emptyForm = (scope, dateStr) => ({
    title: "",
    date: dateStr,
    start: "12:00",
    priority: "ortacha",
    scope,
    notes: "",
    difficulty: 3,
    estimateMin: 30,
});

const Missions = () => {
    const { user } = useUser();
    const { notifyMissionCompleted } = useNotifications();

    const todayStr = useMemo(() => getDateStr(new Date()), []);

    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState(null);
    const [actionError, setActionError] = useState(null);

    const [activeScope, setActiveScope] = useState("bugun");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(() => emptyForm("bugun", todayStr));
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [cancelTarget, setCancelTarget] = useState(null);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelSubmitting, setCancelSubmitting] = useState(false);

    const fetchMissions = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setLoadError(null);
        try {
            const { data } = await missionApi.get("/missions");
            const rawMissions = data.missions || data || [];
            const list = Array.isArray(rawMissions) ? rawMissions : [];
            const owned = list.filter((m) => !m.cancelled && !m.__container);
            setMissions(owned);
        } catch (err) {
            setLoadError(
                err.response?.data?.message || err.message || "Missiyalarni olishda xatolik"
            );
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- montaj vaqtida ma'lumot olish
        fetchMissions();
    }, [fetchMissions]);

    const scopeCounts = useMemo(() => {
        const counts = { bugun: 0, kelgusi: 0, haftalik: 0 };
        missions.forEach((m) => {
            const scope = getMissionScope(m, todayStr);
            if (counts[scope] !== undefined) counts[scope] += 1;
        });
        return counts;
    }, [missions, todayStr]);

    const filtered = useMemo(
        () => missions.filter((m) => getMissionScope(m, todayStr) === activeScope),
        [missions, activeScope, todayStr]
    );

    const sortedFiltered = useMemo(() => {
        return [...filtered].sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            return (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1);
        });
    }, [filtered]);

    const completedCount = filtered.filter((m) => m.completed).length;
    const progressPct = filtered.length > 0 ? (completedCount / filtered.length) * 100 : 0;

    const toggleMission = async (mission) => {
        const nextCompleted = !mission.completed;
        setActionError(null);
        setMissions((prev) =>
            prev.map((m) => (m.id === mission.id ? { ...m, completed: nextCompleted } : m))
        );
        try {
            await missionApi.put(`/missions/${mission.id}`, { completed: nextCompleted });
            if (nextCompleted) notifyMissionCompleted(mission);
        } catch (err) {
            setMissions((prev) =>
                prev.map((m) => (m.id === mission.id ? { ...m, completed: mission.completed } : m))
            );
            setActionError(
                err.response?.data?.message || err.message || "Missiya holatini saqlashda xatolik"
            );
        }
    };

    const removeMission = async (mission) => {
        setActionError(null);
        const previous = missions;
        setMissions((prev) => prev.filter((m) => m.id !== mission.id));
        try {
            await missionApi.delete(`/missions/${mission.id}`);
        } catch (err) {
            setMissions(previous);
            setActionError(
                err.response?.data?.message || err.message || "Missiyani o'chirishda xatolik"
            );
        }
    };

    const openCancel = (mission) => {
        setCancelTarget(mission);
        setCancelReason("");
    };

    const closeCancel = () => {
        if (cancelSubmitting) return;
        setCancelTarget(null);
        setCancelReason("");
    };

    const confirmCancel = async (e) => {
        e.preventDefault();
        if (!cancelTarget) return;
        setCancelSubmitting(true);
        setActionError(null);
        try {
            await missionApi.put(`/missions/${cancelTarget.id}`, {
                cancelled: true,
                reason: cancelReason.trim(),
            });
            setMissions((prev) => prev.filter((m) => m.id !== cancelTarget.id));
            setCancelTarget(null);
            setCancelReason("");
        } catch (err) {
            setActionError(
                err.response?.data?.message || err.message || "Missiyani bekor qilishda xatolik"
            );
        } finally {
            setCancelSubmitting(false);
        }
    };

    const openModal = () => {
        setForm(emptyForm(activeScope, todayStr));
        setFormError(null);
        setShowModal(true);
    };

    const closeModal = () => {
        if (submitting) return;
        setShowModal(false);
    };

    const submitMission = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) {
            setFormError("Missiya nomini kiriting");
            return;
        }
        if (!user) return;

        setSubmitting(true);
        setFormError(null);
        try {
            const { data } = await missionApi.post("/missions", {
                title: form.title.trim(),
                notes: form.notes.trim() || null,
                priority: form.priority,
                scope: form.scope,
                date: form.date || todayStr,
                start: form.start || "12:00",
                difficulty: Number(form.difficulty) || 3,
                estimateMin: Number(form.estimateMin) || 0,
            });
            const created = data.mission || data;
            setMissions((prev) => [...prev, created]);
            setActiveScope(form.scope);
            setShowModal(false);
        } catch (err) {
            setFormError(
                err.response?.data?.message || err.message || "Missiya qo'shishda xatolik"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const anyError = loadError || actionError;

    return (
        <Wrapper>
            <HeaderRow>
                <div>
                    <Title>Missiyalar</Title>
                    <Subtitle>Maqsadlaringizni boshqaring</Subtitle>
                </div>
                <AddButton onClick={openModal}>
                    <Plus size={16} />
                    Yangi missiya
                </AddButton>
            </HeaderRow>

            {anyError && <ErrorBanner>Xatolik yuz berdi: {anyError}</ErrorBanner>}

            <TabsRow>
                {SCOPES.map((scope) => (
                    <TabButton
                        key={scope}
                        $active={activeScope === scope}
                        onClick={() => setActiveScope(scope)}
                    >
                        {SCOPE_LABELS[scope]}
                        <TabCount $active={activeScope === scope}>{scopeCounts[scope]}</TabCount>
                    </TabButton>
                ))}
            </TabsRow>

            {loading && missions.length === 0 ? (
                <StatusText>Yuklanmoqda...</StatusText>
            ) : (
                <>
                    {filtered.length > 0 && (
                        <ProgressCard>
                            <ProgressTrack>
                                <ProgressFill $pct={progressPct} />
                            </ProgressTrack>
                            <ProgressLabel>
                                {completedCount} / {filtered.length} bajarildi
                            </ProgressLabel>
                        </ProgressCard>
                    )}

                    {filtered.length === 0 ? (
                        <EmptyState>
                            <EmptyIcon>
                                <AlertCircle size={32} color={colors.textSubtle} />
                            </EmptyIcon>
                            <EmptyTitle>
                                {SCOPE_LABELS[activeScope]} uchun missiya yo'q
                            </EmptyTitle>
                            <EmptySub>Yangi missiya qo'shib, maqsadlaringizni kuzating</EmptySub>
                            <PrimaryButton onClick={openModal}>
                                <Plus size={15} /> Missiya qo'shish
                            </PrimaryButton>
                        </EmptyState>
                    ) : (
                        <List>
                            {sortedFiltered.map((mission) => {
                                const priorityStyle =
                                    PRIORITY_COLORS[mission.priority] || PRIORITY_COLORS.ortacha;
                                return (
                                    <MissionRow key={mission.id} $done={mission.completed}>
                                        <CheckButton onClick={() => toggleMission(mission)}>
                                            {mission.completed ? (
                                                <CheckCircle2 size={20} color={colors.accent} strokeWidth={2} />
                                            ) : (
                                                <Circle size={20} color={colors.textSubtle} strokeWidth={2} />
                                            )}
                                        </CheckButton>

                                        <MissionBody>
                                            <MissionTitle $done={mission.completed} $hasNote={!!mission.notes}>
                                                {mission.title}
                                            </MissionTitle>
                                            {mission.notes && <MissionNote>{mission.notes}</MissionNote>}
                                            <MissionMeta>
                                                {mission.priority && (
                                                    <PriorityBadge $color={priorityStyle.color} $bg={priorityStyle.bg}>
                                                        {PRIORITY_LABELS[mission.priority] || mission.priority}
                                                    </PriorityBadge>
                                                )}
                                                {mission.start && (
                                                    <MetaTag>
                                                        <Clock size={12} />
                                                        {mission.start}
                                                    </MetaTag>
                                                )}
                                                {mission.date && (
                                                    <MetaTag>
                                                        <Calendar size={12} />
                                                        {new Date(mission.date).toLocaleDateString("uz-UZ", {
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </MetaTag>
                                                )}
                                            </MissionMeta>
                                        </MissionBody>

                                        <RowActions>
                                            <CancelButton
                                                onClick={() => openCancel(mission)}
                                                title="Bekor qilish"
                                            >
                                                <Ban size={14} color={colors.warning} />
                                            </CancelButton>
                                            <RemoveButton onClick={() => removeMission(mission)} title="O'chirish">
                                                <Trash2 size={14} color={colors.textMuted} />
                                            </RemoveButton>
                                        </RowActions>
                                    </MissionRow>
                                );
                            })}
                        </List>
                    )}
                </>
            )}

            {showModal && (
                <ModalOverlay onClick={closeModal}>
                    <ModalBox onClick={(e) => e.stopPropagation()}>
                        <ModalPad>
                            <ModalHeader>
                                <ModalTitle>Yangi missiya</ModalTitle>
                                <CloseButton onClick={closeModal}>
                                    <X size={20} color={colors.textMuted} />
                                </CloseButton>
                            </ModalHeader>

                            <form onSubmit={submitMission}>
                                <FormStack>
                                    <Field>
                                        <FieldLabel>Missiya nomi *</FieldLabel>
                                        <Input
                                            placeholder="Missiyani kiriting..."
                                            value={form.title}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, title: e.target.value }))
                                            }
                                            autoFocus
                                        />
                                    </Field>

                                    <FieldGrid>
                                        <Field>
                                            <FieldLabel>Sana</FieldLabel>
                                            <Input
                                                type="date"
                                                value={form.date}
                                                onChange={(e) =>
                                                    setForm((f) => ({ ...f, date: e.target.value }))
                                                }
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel>Vaqt</FieldLabel>
                                            <Input
                                                type="time"
                                                value={form.start}
                                                onChange={(e) =>
                                                    setForm((f) => ({ ...f, start: e.target.value }))
                                                }
                                            />
                                        </Field>
                                    </FieldGrid>

                                    <FieldGrid>
                                        <Field>
                                            <FieldLabel>Muhimlik</FieldLabel>
                                            <Select
                                                value={form.priority}
                                                onChange={(e) =>
                                                    setForm((f) => ({ ...f, priority: e.target.value }))
                                                }
                                            >
                                                <option value="yuqori">Yuqori</option>
                                                <option value="ortacha">O'rtacha</option>
                                                <option value="past">Past</option>
                                            </Select>
                                        </Field>
                                        <Field>
                                            <FieldLabel>Tur</FieldLabel>
                                            <Select
                                                value={form.scope}
                                                onChange={(e) =>
                                                    setForm((f) => ({ ...f, scope: e.target.value }))
                                                }
                                            >
                                                {SCOPES.map((scope) => (
                                                    <option key={scope} value={scope}>
                                                        {SCOPE_LABELS[scope]}
                                                    </option>
                                                ))}
                                            </Select>
                                        </Field>
                                    </FieldGrid>

                                    <FieldGrid>
                                        <Field>
                                            <FieldLabel>Qiyinlik (1-5)</FieldLabel>
                                            <Select
                                                value={form.difficulty}
                                                onChange={(e) =>
                                                    setForm((f) => ({ ...f, difficulty: e.target.value }))
                                                }
                                            >
                                                {DIFFICULTY_OPTIONS.map((d) => (
                                                    <option key={d} value={d}>
                                                        {d}
                                                    </option>
                                                ))}
                                            </Select>
                                        </Field>
                                        <Field>
                                            <FieldLabel>Taxminiy vaqt (daqiqa)</FieldLabel>
                                            <Input
                                                type="number"
                                                min={5}
                                                step={5}
                                                value={form.estimateMin}
                                                onChange={(e) =>
                                                    setForm((f) => ({ ...f, estimateMin: e.target.value }))
                                                }
                                            />
                                        </Field>
                                    </FieldGrid>

                                    <Field>
                                        <FieldLabel>Izoh</FieldLabel>
                                        <Textarea
                                            placeholder="Qo'shimcha ma'lumot..."
                                            value={form.notes}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, notes: e.target.value }))
                                            }
                                            rows={2}
                                        />
                                    </Field>

                                    {formError && <FieldError>{formError}</FieldError>}

                                    <ModalActions>
                                        <SecondaryButton type="button" onClick={closeModal}>
                                            Bekor qilish
                                        </SecondaryButton>
                                        <PrimaryButton type="submit" $flex $disabled={submitting} disabled={submitting}>
                                            {submitting ? "Saqlanmoqda..." : "Saqlash"}
                                        </PrimaryButton>
                                    </ModalActions>
                                </FormStack>
                            </form>
                        </ModalPad>
                    </ModalBox>
                </ModalOverlay>
            )}
            {cancelTarget && (
                <ModalOverlay onClick={closeCancel}>
                    <ModalBox onClick={(e) => e.stopPropagation()}>
                        <ModalPad>
                            <ModalHeader>
                                <ModalTitle>Missiyani bekor qilish</ModalTitle>
                                <CloseButton onClick={closeCancel}>
                                    <X size={20} color={colors.textMuted} />
                                </CloseButton>
                            </ModalHeader>

                            <form onSubmit={confirmCancel}>
                                <FormStack>
                                    <MissionNote style={{ marginBottom: 4 }}>
                                        "{cancelTarget.title}" bekor qilinadi. Sababini yozib qo'ying —
                                        bu Review sahifasida saqlanadi.
                                    </MissionNote>

                                    <Field>
                                        <FieldLabel>Sabab</FieldLabel>
                                        <Textarea
                                            placeholder="Nega bekor qildingiz?"
                                            value={cancelReason}
                                            onChange={(e) => setCancelReason(e.target.value)}
                                            rows={3}
                                            autoFocus
                                        />
                                    </Field>

                                    <ModalActions>
                                        <SecondaryButton type="button" onClick={closeCancel}>
                                            Orqaga
                                        </SecondaryButton>
                                        <PrimaryButton
                                            type="submit"
                                            $flex
                                            $disabled={cancelSubmitting}
                                            disabled={cancelSubmitting}
                                        >
                                            {cancelSubmitting ? "Saqlanmoqda..." : "Bekor qilishni tasdiqlash"}
                                        </PrimaryButton>
                                    </ModalActions>
                                </FormStack>
                            </form>
                        </ModalPad>
                    </ModalBox>
                </ModalOverlay>
            )}
        </Wrapper>
    );
};

export default Missions;