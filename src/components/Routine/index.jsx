import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Edit2, Trash2, X, Clock, History } from "lucide-react";
import { useRoutine } from "../../context/routine";
import { dedupeRoutines } from "../../utils/routine";
import { DAY_ORDER, DAY_LABELS_UZ } from "../../utils/date";
import {
    Wrapper,
    HeaderRow,
    Title,
    Subtitle,
    AddButton,
    FilterRow,
    FilterChip,
    SummaryGrid,
    SummaryCard,
    SummaryLabel,
    SummaryValue,
    List,
    RoutineRow,
    RoutineIcon,
    RoutineBody,
    RoutineTitleRow,
    RoutineName,
    PriorityBadge,
    RoutineMetaRow,
    TimeTag,
    DaysRow,
    DayChip,
    VersionTag,
    RoutineActions,
    IconButton,
    EmptyState,
    EmptyIcon,
    EmptyTitle,
    EmptySub,
    StatusText,
    ErrorBanner,
    ModalOverlay,
    ModalBox,
    ModalHeader,
    ModalTitle,
    CloseButton,
    ModalPad,
    FieldGrid,
    Field,
    FieldLabel,
    Input,
    Select,
    FieldError,
    DaysPickerRow,
    DayToggle,
    ModalActions,
    PrimaryButton,
    SecondaryButton,
    colors,
} from "./style";

// Kategoriyalar va ularga mos emoji — Figma dizayni bilan bir xil (design reference)
const CATEGORIES = ["Salomatlik", "Jismoniy", "Bilim", "Kasb", "Refleksiya", "Ijtimoiy", "Boshqa"];
const CATEGORY_ICONS = {
    Salomatlik: "💚",
    Jismoniy: "💪",
    Bilim: "📚",
    Kasb: "💼",
    Refleksiya: "🪞",
    Ijtimoiy: "👥",
    Boshqa: "✦",
};

// Missions va Dashboard bilan bir xil muhimlik shkalasi ("yuqori/o'rtacha/past")
const PRIORITY_LABELS = { yuqori: "Yuqori", ortacha: "O'rtacha", past: "Past" };
const PRIORITY_COLORS = {
    yuqori: { color: colors.danger, bg: colors.dangerLight },
    ortacha: { color: colors.warning, bg: colors.warningLight },
    past: { color: colors.success, bg: colors.successLight },
};

const emptyForm = () => ({
    title: "",
    category: CATEGORIES[0],
    priority: "ortacha",
    start: "08:00",
    end: "09:00",
    days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    dayPlans: { mon: "", tue: "", wed: "", thu: "", fri: "", sat: "", sun: "" },
});

const getDuration = (start, end) => {
    if (!start || !end) return "";
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const mins = eh * 60 + em - (sh * 60 + sm);
    return mins > 0 ? `${mins} daq` : "";
};

const Routine = () => {
    const { routines, loading, error, fetchRoutines, createRoutine, updateRoutine, removeRoutine } =
        useRoutine();

    const [actionError, setActionError] = useState(null);
    const [filter, setFilter] = useState("Hammasi");

    const [showModal, setShowModal] = useState(false);
    const [editingRoutine, setEditingRoutine] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [removingId, setRemovingId] = useState(null);

    useEffect(() => {
        fetchRoutines();
    }, [fetchRoutines]);

    // Faol (retired bo'lmagan, har bir sarlavha uchun eng so'nggi versiya) odatlar ro'yxati
    const activeRoutines = useMemo(() => dedupeRoutines(routines), [routines]);

    const sortedRoutines = useMemo(
        () => [...activeRoutines].sort((a, b) => (a.start || "").localeCompare(b.start || "")),
        [activeRoutines]
    );

    const categories = useMemo(
        () => ["Hammasi", ...Array.from(new Set(activeRoutines.map((r) => r.category).filter(Boolean)))],
        [activeRoutines]
    );

    const filtered = useMemo(
        () => (filter === "Hammasi" ? sortedRoutines : sortedRoutines.filter((r) => r.category === filter)),
        [sortedRoutines, filter]
    );

    const openAdd = () => {
        setForm(emptyForm());
        setEditingRoutine(null);
        setFormError(null);
        setShowModal(true);
    };

    const openEdit = (routine) => {
        setForm({
            title: routine.title || "",
            category: routine.category || CATEGORIES[0],
            priority: routine.priority || "ortacha",
            start: routine.start || "08:00",
            end: routine.end || "09:00",
            days: routine.days && routine.days.length ? routine.days : ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
            dayPlans: routine.dayPlans || { mon: "", tue: "", wed: "", thu: "", fri: "", sat: "", sun: "" },
        });
        setEditingRoutine(routine);
        setFormError(null);
        setShowModal(true);
    };

    const closeModal = () => {
        if (submitting) return;
        setShowModal(false);
    };

    const toggleDay = (day) => {
        setForm((f) => ({
            ...f,
            days: f.days.includes(day) ? f.days.filter((d) => d !== day) : [...f.days, day],
        }));
    };

    const submitRoutine = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) {
            setFormError("Odat nomini kiriting");
            return;
        }

        const payload = {
            title: form.title.trim(),
            category: form.category,
            icon: CATEGORY_ICONS[form.category] || "✦",
            priority: form.priority,
            start: form.start,
            end: form.end,
            days: form.days,
            dayPlans: form.dayPlans,
        };

        setSubmitting(true);
        setFormError(null);
        try {
            if (editingRoutine) {
                await updateRoutine(editingRoutine, payload);
            } else {
                await createRoutine(payload);
            }
            setShowModal(false);
        } catch (err) {
            setFormError(
                err.response?.data?.message || err.message || "Odatni saqlashda xatolik"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleRemove = useCallback(
        async (routine) => {
            setActionError(null);
            setRemovingId(routine.id);
            try {
                await removeRoutine(routine);
            } catch (err) {
                setActionError(
                    err.response?.data?.message || err.message || "Odatni o'chirishda xatolik"
                );
            } finally {
                setRemovingId(null);
            }
        },
        [removeRoutine]
    );

    const anyError = error || actionError;

    return (
        <Wrapper>
            <HeaderRow>
                <div>
                    <Title>Routine</Title>
                    <Subtitle>Fundamental odatlar tizimi</Subtitle>
                </div>
                <AddButton onClick={openAdd}>
                    <Plus size={16} />
                    Yangi odat
                </AddButton>
            </HeaderRow>

            {anyError && <ErrorBanner>Xatolik yuz berdi: {anyError}</ErrorBanner>}

            {loading && activeRoutines.length === 0 ? (
                <StatusText>Yuklanmoqda...</StatusText>
            ) : (
                <>
                    <FilterRow>
                        {categories.map((cat) => (
                            <FilterChip key={cat} $active={filter === cat} onClick={() => setFilter(cat)}>
                                {cat !== "Hammasi" && CATEGORY_ICONS[cat] ? `${CATEGORY_ICONS[cat]} ` : ""}
                                {cat}
                            </FilterChip>
                        ))}
                    </FilterRow>

                    <SummaryGrid>
                        <SummaryCard>
                            <SummaryLabel>Jami odatlar</SummaryLabel>
                            <SummaryValue>{activeRoutines.length}</SummaryValue>
                        </SummaryCard>
                        <SummaryCard>
                            <SummaryLabel>Har kuni</SummaryLabel>
                            <SummaryValue>
                                {activeRoutines.filter((r) => (r.days || []).length === 7).length}
                            </SummaryValue>
                        </SummaryCard>
                        <SummaryCard>
                            <SummaryLabel>Hafta kunlari</SummaryLabel>
                            <SummaryValue>
                                {activeRoutines.filter((r) => (r.days || []).length < 7).length}
                            </SummaryValue>
                        </SummaryCard>
                    </SummaryGrid>

                    {filtered.length === 0 ? (
                        <EmptyState>
                            <EmptyIcon>🌱</EmptyIcon>
                            <EmptyTitle>Hali fundamental odatlar qo'shilmagan</EmptyTitle>
                            <EmptySub>Kundalik tizimingizni boshlash uchun birinchi odatni qo'shing</EmptySub>
                            <PrimaryButton onClick={openAdd}>
                                <Plus size={15} /> Odat qo'shish
                            </PrimaryButton>
                        </EmptyState>
                    ) : (
                        <List>
                            {filtered.map((routine) => {
                                const priorityStyle = PRIORITY_COLORS[routine.priority] || PRIORITY_COLORS.ortacha;
                                const duration = getDuration(routine.start, routine.end);
                                return (
                                    <RoutineRow key={routine.id} $pending={removingId === routine.id}>
                                        <RoutineIcon>
                                            {routine.icon || CATEGORY_ICONS[routine.category] || "✦"}
                                        </RoutineIcon>
                                        <RoutineBody>
                                            <RoutineTitleRow>
                                                <RoutineName>{routine.title}</RoutineName>
                                                {routine.priority && (
                                                    <PriorityBadge $color={priorityStyle.color} $bg={priorityStyle.bg}>
                                                        {PRIORITY_LABELS[routine.priority] || routine.priority}
                                                    </PriorityBadge>
                                                )}
                                            </RoutineTitleRow>
                                            <RoutineMetaRow>
                                                {routine.start && (
                                                    <TimeTag>
                                                        <Clock size={12} />
                                                        {routine.start} – {routine.end}
                                                        {duration && <span>({duration})</span>}
                                                    </TimeTag>
                                                )}
                                                <DaysRow>
                                                    {DAY_ORDER.map((day, i) => (
                                                        <DayChip key={day} $active={(routine.days || []).includes(day)}>
                                                            {DAY_LABELS_UZ[i]}
                                                        </DayChip>
                                                    ))}
                                                </DaysRow>
                                                {routine.versions > 1 && (
                                                    <VersionTag>
                                                        <History size={11} />
                                                        {routine.versions} marta o'zgartirildi
                                                    </VersionTag>
                                                )}
                                            </RoutineMetaRow>
                                        </RoutineBody>
                                        <RoutineActions>
                                            <IconButton onClick={() => openEdit(routine)} disabled={removingId === routine.id}>
                                                <Edit2 size={15} />
                                            </IconButton>
                                            <IconButton
                                                $danger
                                                onClick={() => handleRemove(routine)}
                                                disabled={removingId === routine.id}
                                            >
                                                <Trash2 size={15} />
                                            </IconButton>
                                        </RoutineActions>
                                    </RoutineRow>
                                );
                            })}
                        </List>
                    )}
                </>
            )}

            {showModal && (
                <ModalOverlay onClick={closeModal}>
                    <ModalBox onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>{editingRoutine ? "Odatni tahrirlash" : "Yangi odat"}</ModalTitle>
                            <CloseButton onClick={closeModal}>
                                <X size={20} color={colors.textMuted} />
                            </CloseButton>
                        </ModalHeader>

                        <ModalPad as="form" onSubmit={submitRoutine}>
                            <Field>
                                <FieldLabel>Odat nomi *</FieldLabel>
                                <Input
                                    placeholder="Masalan: Ertalabki yugurish"
                                    value={form.title}
                                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                    autoFocus
                                />
                            </Field>

                            <FieldGrid>
                                <Field>
                                    <FieldLabel>Kategoriya</FieldLabel>
                                    <Select
                                        value={form.category}
                                        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                                    >
                                        {CATEGORIES.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </Select>
                                </Field>
                                <Field>
                                    <FieldLabel>Muhimlik</FieldLabel>
                                    <Select
                                        value={form.priority}
                                        onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                                    >
                                        <option value="yuqori">Yuqori</option>
                                        <option value="ortacha">O'rtacha</option>
                                        <option value="past">Past</option>
                                    </Select>
                                </Field>
                            </FieldGrid>

                            <FieldGrid>
                                <Field>
                                    <FieldLabel>Boshlanish vaqti</FieldLabel>
                                    <Input
                                        type="time"
                                        value={form.start}
                                        onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>Tugash vaqti</FieldLabel>
                                    <Input
                                        type="time"
                                        value={form.end}
                                        onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))}
                                    />
                                </Field>
                            </FieldGrid>

                            <Field>
                                <FieldLabel>Faol kunlar</FieldLabel>
                                <DaysPickerRow>
                                    {DAY_ORDER.map((day, i) => (
                                        <DayToggle
                                            key={day}
                                            type="button"
                                            $active={form.days.includes(day)}
                                            onClick={() => toggleDay(day)}
                                        >
                                            {DAY_LABELS_UZ[i]}
                                        </DayToggle>
                                    ))}
                                </DaysPickerRow>
                            </Field>

                            <Field>
                                <FieldLabel>Haftalik Kunma-Kun Rejalar (Har bir kun uchun maxsus vazifa)</FieldLabel>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "6px" }}>
                                    {DAY_ORDER.map((dayKey, i) => (
                                        <div key={dayKey} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                                            <span style={{ fontSize: "11px", color: colors.amber, fontWeight: 600 }}>
                                                {DAY_LABELS_UZ[i]}
                                            </span>
                                            <Input
                                                placeholder={dayKey === 'mon' ? 'Masalan: TartibOS' : dayKey === 'tue' ? 'UI/UX style' : 'Reja kiritish...'}
                                                value={form.dayPlans?.[dayKey] || ""}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setForm((f) => ({
                                                        ...f,
                                                        dayPlans: { ...(f.dayPlans || {}), [dayKey]: val },
                                                    }));
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </Field>

                            {formError && <FieldError>{formError}</FieldError>}

                            <ModalActions>
                                <SecondaryButton type="button" onClick={closeModal}>
                                    Bekor qilish
                                </SecondaryButton>
                                <PrimaryButton type="submit" $flex $disabled={submitting} disabled={submitting}>
                                    {submitting ? "Saqlanmoqda..." : editingRoutine ? "Saqlash" : "Qo'shish"}
                                </PrimaryButton>
                            </ModalActions>
                        </ModalPad>
                    </ModalBox>
                </ModalOverlay>
            )}
        </Wrapper>
    );
};

export default Routine;