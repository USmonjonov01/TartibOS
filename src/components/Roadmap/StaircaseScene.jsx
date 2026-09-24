import { useEffect, useMemo, useRef, useState } from "react";
import { MoreVertical, Pencil, Archive, ArchiveRestore, Trash2, X } from "lucide-react";
import { getGoalLevel } from "../../context/goals";
import {
    GoalHeaderRow,
    GoalTitle,
    GoalMeta,
    StaircaseSvgBox,
    StaircaseScrollArea,
    LevelPanel,
    LevelBadge,
    LevelBadgeLabel,
    LevelBadgeNum,
    XPBarWrap,
    XPBarTopRow,
    XPBarStage,
    XPBarCount,
    XPBarTrack,
    XPBarFill,
    CelebrateOverlay,
    CelebrateBurst,
    CelebrateSub,
    ConfettiPiece,
    StepList,
    StepRow,
    StepCheck,
    StepTitle,
    StepStage,
    NextBadge,
    AddStepRow,
    AddStepInput,
    AddStepBtn,
    MenuWrap,
    MenuButton,
    MenuDropdown,
    MenuItem,
    RenameInput,
    StepActions,
    StepIconBtn,
    StepEditInput,
    CompletedBanner,
    SmallGhostButton,
    colors,
} from "./style";

const CONFETTI_COLORS = [colors.primary, colors.success, "#F4C575", "#6EE7B7"];

// Konfetti bo'laklari — har bir "level up" portlashi uchun qayta generatsiya
// qilinadi (burstId o'zgarganda), shu sabab CSS animatsiya har safar qaytadan
// boshidan ishga tushadi.
const makeConfetti = () =>
    Array.from({ length: 16 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5) * 0.4;
        const dist = 60 + Math.random() * 70;
        return {
            id: i,
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist - 20,
            rot: Math.round((Math.random() - 0.5) * 360),
            delay: Math.random() * 0.12,
            color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        };
    });

// Zinapoya dizayni — har bir bosqich alohida "pog'ona" (tread) sifatida
// chiziladi, chapdan (poydevor) o'ngga-yuqoriga (cho'qqi/goal) qarab
// ko'tariladi. Pog'onalar soni = shu Goal'dagi bosqichlar soni bo'yicha
// dinamik hisoblanadi, shu sababli har bir Goal o'z zinapoyasiga ega bo'ladi.

// Har bir pog'ona uchun O'ZGARMAS o'lcham — bosqichlar soni qancha ko'p
// bo'lmasin (5 ta ham, 25 ta ham), bitta pog'ona hech qachon kichraymaydi.
// Buning o'rniga butun sahna kengroq/balandroq bo'ladi, va uni gorizontal
// scroll qilib ko'rish mumkin (StaircaseScrollArea'ga qarang). O'lchamlar
// StaircaseSvgBox'ning katta (460px balandlik) sahnasiga mos — kichik
// "widget" emas, haqiqiy o'sish landshafti hissini berish uchun.
const STEP_WIDTH = 58; // bitta pog'onaning kengligi (gorizontal)
const STEP_RISE = 28; // bitta pog'onaning balandligi (vertikal ko'tarilish)
const GAP = 5; // pog'onalar orasidagi tirqish
const LEFT_X = 36;
const TOP_PAD = 78; // eng baland pog'ona ustida bayroq/nom uchun joy
const BOTTOM_PAD = 34; // poydevor ostida "siz shu yerdasiz" belgisi uchun joy
const RIGHT_PAD = 44;
// "flag-checkered" ikonkasi 640x640 viewBox'da chizilgan (Font Awesome) —
// shu koeffitsient bilan sahnaga mos kichraytiriladi (natijada taxminan
// 28-30px balandlikdagi bayroq chiqadi, eski qo'lda chizilgan bayroq bilan
// bir xil joyga to'g'ri keladi).
const FLAG_SCALE = 0.055;

function StaircaseScene({
    goal,
    onToggleStep,
    onAddStep,
    onRenameGoal,
    onArchiveGoal,
    onRequestDeleteGoal,
    onUpdateStep,
    onRequestDeleteStep,
}) {
    const [newStepTitle, setNewStepTitle] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [renaming, setRenaming] = useState(false);
    const [titleDraft, setTitleDraft] = useState(goal.title);
    const [editingStepId, setEditingStepId] = useState(null);
    const [stepDraft, setStepDraft] = useState("");

    const steps = goal.steps || [];
    const total = steps.length;
    const completedCount = steps.filter((s) => s.completed).length;
    const nextStepIndex = steps.findIndex((s) => !s.completed);
    const reachedTop = total > 0 && nextStepIndex === -1;

    const currentStage =
        [...steps].reverse().find((s) => s.completed)?.stageLabel || "Sayohat boshlandi";

    // Pog'onalar geometriyasi — har bir pog'ona O'LCHAMI o'zgarmas
    // (STEP_WIDTH/STEP_RISE), shu sababli hech qachon kichraymaydi/siqilib
    // qolmaydi. Bosqichlar ko'p bo'lsa, buning o'rniga butun SVG kengroq va
    // balandroq bo'ladi (svgWidth/svgHeight quyida), va tashqi konteyner
    // uni scroll qilib ko'rsatadi.
    const stepCount = total > 0 ? total : 4; // bosqich yo'q bo'lsa — 4 ta "duxovka" pog'ona
    const svgWidth = LEFT_X + stepCount * STEP_WIDTH + RIGHT_PAD;
    const svgHeight = TOP_PAD + stepCount * STEP_RISE + BOTTOM_PAD;
    const GROUND_Y = svgHeight - BOTTOM_PAD;

    const treadTopY = (i) => GROUND_Y - (i + 1) * STEP_RISE;
    const treadX = (i) => LEFT_X + i * STEP_WIDTH;
    const treadCenterX = (i) => treadX(i) + (STEP_WIDTH - GAP) / 2;

    // Bayroq — eng oxirgi (eng baland) pog'ona ustida, Goal nomi bilan.
    const flagX = total > 0 ? treadCenterX(total - 1) : treadCenterX(0);
    const flagTopY = total > 0 ? treadTopY(total - 1) : treadTopY(0);

    // "Siz hozir shu yerdasiz" belgisi — oxirgi bajarilgan pog'ona ustida,
    // hali hech qaysi bosqich bajarilmagan bo'lsa — poydevorda turadi.
    let markerX;
    let markerY;
    if (total === 0) {
        markerX = LEFT_X - 6;
        markerY = GROUND_Y;
    } else if (reachedTop) {
        markerX = flagX;
        markerY = flagTopY - 14;
    } else if (nextStepIndex <= 0) {
        markerX = LEFT_X - 6;
        markerY = GROUND_Y;
    } else {
        markerX = treadCenterX(nextStepIndex - 1);
        markerY = treadTopY(nextStepIndex - 1) - 14;
    }

    // "LEVEL UP!" portlashi — bosqich soni oshganda (ya'ni yangi bosqich
    // bajarilganda) 1.3 soniyaga konfetti + katta "LEVEL UP!" matni chiqadi.
    // Bosqich bekor qilinganda (completedCount kamayganda) hech narsa
    // ko'rsatilmaydi — faqat progress oldinga ketganda nishonlanadi.
    const [celebrate, setCelebrate] = useState(false);
    const [burstId, setBurstId] = useState(0);
    const prevCompletedRef = useRef(completedCount);

    useEffect(() => {
        if (completedCount > prevCompletedRef.current) {
            setCelebrate(true);
            setBurstId((id) => id + 1);
            const t = setTimeout(() => setCelebrate(false), 1300);
            prevCompletedRef.current = completedCount;
            return () => clearTimeout(t);
        }
        prevCompletedRef.current = completedCount;
    }, [completedCount]);

    // eslint-disable-next-line react-hooks/exhaustive-deps -- burstId ataylab dependency: har safar o'zgarganda konfetti qayta generatsiya qilinishi kerak
    const confetti = useMemo(() => makeConfetti(), [burstId]);
    const xpPct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    const level = getGoalLevel(goal);

    const handleAddStep = (e) => {
        e.preventDefault();
        const title = newStepTitle.trim();
        if (!title) return;
        onAddStep(goal.id, { title });
        setNewStepTitle("");
    };

    const submitRename = () => {
        const title = titleDraft.trim();
        setRenaming(false);
        if (title && title !== goal.title) onRenameGoal(goal.id, title);
        else setTitleDraft(goal.title);
    };

    const startEditStep = (step) => {
        setEditingStepId(step.id);
        setStepDraft(step.title);
    };

    const submitStepEdit = (step) => {
        const title = stepDraft.trim();
        setEditingStepId(null);
        if (title && title !== step.title) onUpdateStep(goal.id, step.id, { title });
    };

    return (
        <div>
            {total > 0 && completedCount === total && goal.status !== "archived" && (
                <CompletedBanner>
                    <span>🏁 Tabriklaymiz! Bu maqsadning barcha bosqichlari bajarildi.</span>
                    <SmallGhostButton onClick={() => onArchiveGoal(goal.id, "archived")}>
                        Arxivlash
                    </SmallGhostButton>
                </CompletedBanner>
            )}

            <GoalHeaderRow>
                <div style={{ flex: 1, minWidth: 0 }}>
                    {renaming ? (
                        <RenameInput
                            autoFocus
                            value={titleDraft}
                            onChange={(e) => setTitleDraft(e.target.value)}
                            onBlur={submitRename}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") submitRename();
                                if (e.key === "Escape") {
                                    setTitleDraft(goal.title);
                                    setRenaming(false);
                                }
                            }}
                        />
                    ) : (
                        <GoalTitle>{goal.title}</GoalTitle>
                    )}
                    <div style={{ fontSize: 12, color: colors.textSubtle, marginTop: 2 }}>
                        Hozirgi bosqich: {currentStage}
                    </div>
                </div>
                <GoalMeta>
                    {completedCount}/{total} bosqich
                </GoalMeta>
                <MenuWrap>
                    <MenuButton onClick={() => setMenuOpen((v) => !v)}>
                        <MoreVertical size={16} />
                    </MenuButton>
                    {menuOpen && (
                        <MenuDropdown onMouseLeave={() => setMenuOpen(false)}>
                            <MenuItem
                                onClick={() => {
                                    setRenaming(true);
                                    setMenuOpen(false);
                                }}
                            >
                                <Pencil size={14} /> Nomini tahrirlash
                            </MenuItem>
                            {goal.status === "archived" ? (
                                <MenuItem
                                    onClick={() => {
                                        onArchiveGoal(goal.id, "active");
                                        setMenuOpen(false);
                                    }}
                                >
                                    <ArchiveRestore size={14} /> Faollashtirish
                                </MenuItem>
                            ) : (
                                <MenuItem
                                    onClick={() => {
                                        onArchiveGoal(goal.id, "archived");
                                        setMenuOpen(false);
                                    }}
                                >
                                    <Archive size={14} /> Arxivlash
                                </MenuItem>
                            )}
                            <MenuItem
                                $danger
                                onClick={() => {
                                    setMenuOpen(false);
                                    onRequestDeleteGoal(goal);
                                }}
                            >
                                <Trash2 size={14} /> O'chirish
                            </MenuItem>
                        </MenuDropdown>
                    )}
                </MenuWrap>
            </GoalHeaderRow>

            <LevelPanel>
                <LevelBadge>
                    <LevelBadgeLabel>Lvl</LevelBadgeLabel>
                    <LevelBadgeNum>{level}</LevelBadgeNum>
                </LevelBadge>
                <XPBarWrap>
                    <XPBarTopRow>
                        <XPBarStage>{currentStage}</XPBarStage>
                        <XPBarCount>{completedCount}/{total || 0} XP</XPBarCount>
                    </XPBarTopRow>
                    <XPBarTrack>
                        <XPBarFill $pct={xpPct} />
                    </XPBarTrack>
                </XPBarWrap>
            </LevelPanel>

            <StaircaseSvgBox>
                <CelebrateOverlay $show={celebrate}>
                    <CelebrateBurst key={burstId} $show={celebrate}>
                        LEVEL UP!
                    </CelebrateBurst>
                    <CelebrateSub $show={celebrate}>Lvl {level} — {currentStage}</CelebrateSub>
                    {confetti.map((c) => (
                        <ConfettiPiece
                            key={`${burstId}-${c.id}`}
                            $show={celebrate}
                            $x={c.x}
                            $y={c.y}
                            $rot={c.rot}
                            $delay={c.delay}
                            $color={c.color}
                        />
                    ))}
                </CelebrateOverlay>

                <StaircaseScrollArea>
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width={svgWidth} height={svgHeight} style={{ display: "block" }}>
                    <defs>
                        <linearGradient id={`stepFillDone-${goal.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={colors.success} stopOpacity="1" />
                            <stop offset="100%" stopColor={colors.success} stopOpacity="0.72" />
                        </linearGradient>
                        <linearGradient id={`stepFillNext-${goal.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.32" />
                            <stop offset="100%" stopColor={colors.primary} stopOpacity="0.14" />
                        </linearGradient>
                        <radialGradient id={`topGlow-${goal.id}`} cx="50%" cy="0%" r="70%">
                            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.14" />
                            <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
                        </radialGradient>
                        <filter id={`flagShadow-${goal.id}`} x="-60%" y="-60%" width="220%" height="220%">
                            <feDropShadow dx="0" dy="1.5" stdDeviation="1.6" floodColor="#000" floodOpacity="0.35" />
                        </filter>
                        <style>
                            {`
                                @keyframes tos-pulse-ring {
                                    0%   { r: 9;  opacity: 0.55; }
                                    70%  { r: 20; opacity: 0; }
                                    100% { r: 20; opacity: 0; }
                                }
                                @keyframes tos-pulse-core {
                                    0%, 100% { transform: scale(1); }
                                    50%      { transform: scale(1.12); }
                                }
                                @keyframes tos-glow-step {
                                    0%, 100% { opacity: 0.85; }
                                    50%      { opacity: 1; }
                                }
                                .tos-pulse-ring { animation: tos-pulse-ring 2.2s ease-out infinite; transform-origin: center; }
                                .tos-pulse-core { animation: tos-pulse-core 2.2s ease-in-out infinite; transform-origin: center; }
                                .tos-glow-step { animation: tos-glow-step 2.2s ease-in-out infinite; }
                            `}
                        </style>
                    </defs>

                    {/* Cho'qqi tomon yorug'lik — atmosfera */}
                    <rect x="0" y="0" width={svgWidth} height={svgHeight} fill={`url(#topGlow-${goal.id})`} />

                    {/* Poydevor chizig'i */}
                    <line
                        x1={LEFT_X - 16}
                        y1={GROUND_Y}
                        x2={LEFT_X + stepCount * STEP_WIDTH + 16}
                        y2={GROUND_Y}
                        stroke={colors.border}
                        strokeWidth="1.5"
                        opacity="0.6"
                    />

                    {/* Pog'onalar — har biri bitta bosqich */}
                    {total === 0 ? (
                        // Hali bosqich yo'q — xira "duxovka" zinapoya taklifi
                        Array.from({ length: 4 }).map((_, i) => (
                            <rect
                                key={i}
                                x={treadX(i)}
                                y={treadTopY(i)}
                                width={STEP_WIDTH - GAP}
                                height={GROUND_Y - treadTopY(i)}
                                rx="3"
                                fill="none"
                                stroke={colors.border}
                                strokeDasharray="3 4"
                                strokeWidth="1.5"
                                opacity="0.55"
                            />
                        ))
                    ) : (
                        steps.map((step, i) => {
                            const x = treadX(i);
                            const y = treadTopY(i);
                            const w = STEP_WIDTH - GAP;
                            const h = GROUND_Y - y;
                            const isNext = i === nextStepIndex;
                            const fill = step.completed
                                ? `url(#stepFillDone-${goal.id})`
                                : isNext
                                  ? `url(#stepFillNext-${goal.id})`
                                  : colors.surfaceRaised;
                            const stroke = step.completed
                                ? colors.success
                                : isNext
                                  ? colors.primary
                                  : colors.border;

                            return (
                                <g key={step.id}>
                                    <rect
                                        x={x}
                                        y={y}
                                        width={w}
                                        height={h}
                                        rx="4"
                                        fill={fill}
                                        stroke={stroke}
                                        strokeWidth={isNext ? "1.75" : "1.25"}
                                        strokeDasharray={step.completed || isNext ? "none" : "2 4"}
                                        className={isNext ? "tos-glow-step" : undefined}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => onToggleStep(goal.id, step.id)}
                                    />

                                    {/* Pog'ona ustidagi belgi (bosqich holati) */}
                                    <g
                                        transform={`translate(${x + w / 2}, ${y - 11})`}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => onToggleStep(goal.id, step.id)}
                                    >
                                        {isNext && (
                                            <circle
                                                r="9"
                                                fill="none"
                                                stroke={colors.primary}
                                                strokeWidth="1.5"
                                                className="tos-pulse-ring"
                                            />
                                        )}
                                        <circle
                                            r="6.5"
                                            fill={step.completed ? colors.success : colors.surface}
                                            stroke={step.completed ? colors.success : isNext ? colors.primary : colors.border}
                                            strokeWidth="1.75"
                                        />
                                        {step.completed && (
                                            <path
                                                d="M-2.8,0 L-0.6,2.4 L3,-2.6"
                                                fill="none"
                                                stroke="#fff"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        )}
                                    </g>
                                </g>
                            );
                        })
                    )}

                    {/* Cho'qqidagi bayroq — Goal nomi (Font Awesome "flag-checkered" ikonkasi) */}
                    <g
                        transform={`translate(${flagX + 120 * FLAG_SCALE}, ${flagTopY - 580 * FLAG_SCALE}) scale(${FLAG_SCALE})`}
                        filter={`url(#flagShadow-${goal.id})`}
                    >
                        <path
                            d="M128 64C145.7 64 160 78.3 160 96L160 112L229 94.8C267.1 85.3 307.3 89.7 342.5 107.3C388.8 130.5 443.3 130.5 489.6 107.3L499.2 102.5C519.8 92.1 544 107.1 544 130.1L544 409.8C544 423.1 535.7 435.1 523.2 439.8L488.5 452.8C442.3 470.1 390.9 467.4 346.8 445.4C308.9 426.4 265.4 421.7 224.3 432L160 448L160 544C160 561.7 145.7 576 128 576C110.3 576 96 561.7 96 544L96 96C96 78.3 110.3 64 128 64zM160 251.1L224 237.2L224 302.7L160 316.6L160 382.1L208.8 369.9C213.9 368.6 218.9 367.5 224 366.6L224 302.7L262.9 294.3C271.2 292.5 279.6 291.8 288 292.2L288 228.2C301.6 228.6 315.2 230.8 328.4 234.6L352 241.5L352 308.2L310.3 295.9C303 293.8 295.5 292.5 288 292.1L288 363.5C309.8 365.4 331.3 370.2 352 377.9L352 308.1L374.7 314.8C388.2 318.8 402 321.2 416 322.2L416 258C408.2 257.2 400.4 255.7 392.8 253.5L352 241.5L352 179.5C339 175.7 326.2 170.7 313.8 164.5C305.6 160.4 296.9 157.5 288 155.7L288 228.1C275 227.7 262 228.9 249.3 231.7L224 237.2L224 162L160 178L160 251.1zM416 399.7C432.8 401.2 449.9 399 466 392.9L480 387.7L480 316L472.1 317.8C453.7 322.1 434.8 323.5 416 322.3L416 399.7zM480 250.3L480 179.5C459.1 185.6 437.6 188.6 416 188.6L416 258C429.9 259.4 444 258.5 457.7 255.4L480 250.2z"
                            fill={reachedTop ? colors.success : colors.primary}
                        />
                    </g>
                    <text
                        x={flagX}
                        y={flagTopY - 34}
                        textAnchor="middle"
                        fontSize="10.5"
                        fontWeight="700"
                        fill={colors.text}
                        opacity="0.85"
                    >
                        {goal.title.length > 26 ? goal.title.slice(0, 24) + "…" : goal.title}
                    </text>

                    {/* "Siz hozir shu yerdasiz" — nafas oluvchi belgi */}
                    <g transform={`translate(${markerX}, ${markerY})`}>
                        <circle r="9" fill="none" stroke={colors.primary} strokeWidth="1.5" className="tos-pulse-ring" />
                        <circle r="5.5" fill={colors.primary} className="tos-pulse-core" />
                        <circle r="2" fill="#fff" />
                    </g>
                </svg>
                </StaircaseScrollArea>
            </StaircaseSvgBox>

            <StepList>
                {steps.map((step, i) => {
                    const isNext = i === nextStepIndex;
                    return (
                        <StepRow
                            key={step.id}
                            $next={isNext}
                            onClick={() => editingStepId !== step.id && onToggleStep(goal.id, step.id)}
                        >
                            <StepCheck $done={step.completed} $next={isNext}>
                                {step.completed && (
                                    <svg width="10" height="10" viewBox="0 0 10 10">
                                        <path
                                            d="M1.5,5.2 L4,7.7 L8.5,2.2"
                                            fill="none"
                                            stroke="#fff"
                                            strokeWidth="1.6"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                            </StepCheck>

                            {editingStepId === step.id ? (
                                <StepEditInput
                                    autoFocus
                                    value={stepDraft}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => setStepDraft(e.target.value)}
                                    onBlur={() => submitStepEdit(step)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") submitStepEdit(step);
                                        if (e.key === "Escape") setEditingStepId(null);
                                    }}
                                />
                            ) : (
                                <>
                                    <StepTitle $done={step.completed} $next={isNext}>{step.title}</StepTitle>
                                    {step.stageLabel && <StepStage>{step.stageLabel}</StepStage>}
                                    {isNext && <NextBadge>Navbatdagi</NextBadge>}
                                    <StepActions onClick={(e) => e.stopPropagation()}>
                                        <StepIconBtn onClick={() => startEditStep(step)}>
                                            <Pencil size={12} />
                                        </StepIconBtn>
                                        <StepIconBtn $danger onClick={() => onRequestDeleteStep(goal.id, step)}>
                                            <X size={13} />
                                        </StepIconBtn>
                                    </StepActions>
                                </>
                            )}
                        </StepRow>
                    );
                })}
            </StepList>

            <AddStepRow onSubmit={handleAddStep}>
                <AddStepInput
                    placeholder="Yangi bosqich qo'shish..."
                    value={newStepTitle}
                    onChange={(e) => setNewStepTitle(e.target.value)}
                />
                <AddStepBtn type="submit">+</AddStepBtn>
            </AddStepRow>
        </div>
    );
}

export default StaircaseScene;