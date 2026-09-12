import { useState } from "react";
import {
    GoalHeaderRow,
    GoalTitle,
    GoalMeta,
    MountainSvgBox,
    StepList,
    StepRow,
    StepCheck,
    StepTitle,
    StepStage,
    AddStepRow,
    AddStepInput,
    AddStepBtn,
    colors,
} from "./style";

// Old ustunlik: NotFound sahifasidagi LostTrailIllustration bilan bir xil
// vizual til — yupqa chiziq (stroke), to'ldirilgan shakllar emas, uzuq-uzuq
// yo'lka, kichik doira belgilar. Bu yerda shu tilni Yo'l xaritasi
// masshtabiga (400x300, ko'p bosqichli) kengaytiramiz.

// Orqa fondagi xira tizma — chuqurlik hissi uchun, asosiy tog'dan orqada.
const BACK_RIDGE = "M-10,270 L50,205 L95,232 L150,150 L205,220 L260,175 L320,225 L410,270";
// Old plandagi asosiy tizma — o'tkirroq chiziq, NotFound'dagi zigzag ritmiga mos.
const FRONT_RIDGE = "M10,270 L85,150 L125,195 L195,80 L260,190 L305,130 L390,270";

// Tizmadagi eng baland nuqta — bayroq shu yerga qo'yiladi.
const PEAK = { x: 195, y: 80 };

// Trail bo'ylab t (0..1) ga mos (x, y). t=0 — etak, t=1 — deyarli cho'qqi.
// Amplituda va davr NotFound'dagi silliq "Q" egri chizig'iga yaqinroq bo'lishi
// uchun ancha pasaytirilgan — bu tabiiy tog' yo'lkasi tuyg'usini beradi,
// asabiy zigzak emas.
const trailPoint = (t) => {
    const x = 195 + 68 * Math.sin(t * Math.PI * 1.5 + 0.3);
    const y = 258 - t * 168;
    return { x, y };
};

const buildTrailPath = () => {
    const samples = 48;
    const pts = Array.from({ length: samples + 1 }, (_, i) => trailPoint(i / samples));
    return "M" + pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L");
};

const TRAIL_D = buildTrailPath();

function MountainScene({ goal, onToggleStep, onAddStep }) {
    const [newStepTitle, setNewStepTitle] = useState("");
    const steps = goal.steps || [];
    const total = steps.length;
    const completedCount = steps.filter((s) => s.completed).length;
    const progress = total > 0 ? completedCount / total : 0;
    const currentPos = trailPoint(progress);
    // Keyingi bajarilishi kerak bo'lgan bosqich — shu birgina belgi "nafas oladi"
    // (pulse), qolganlari sokin turadi. Shu orqali "hozir aynan shu yerdaman,
    // keyingi qadam shu" tuyg'usi beriladi.
    const nextStepIndex = steps.findIndex((s) => !s.completed);

    const currentStage =
        [...steps].reverse().find((s) => s.completed)?.stageLabel || "Sayohat boshlandi";

    const handleAddStep = (e) => {
        e.preventDefault();
        const title = newStepTitle.trim();
        if (!title) return;
        onAddStep(goal.id, { title });
        setNewStepTitle("");
    };

    return (
        <div>
            <GoalHeaderRow>
                <div>
                    <GoalTitle>{goal.title}</GoalTitle>
                    <div style={{ fontSize: 12, color: colors.textSubtle, marginTop: 2 }}>
                        Hozirgi bosqich: {currentStage}
                    </div>
                </div>
                <GoalMeta>
                    {completedCount}/{total} bosqich
                </GoalMeta>
            </GoalHeaderRow>

            <MountainSvgBox>
                <svg viewBox="0 0 400 300" width="100%" height="100%">
                    <defs>
                        <radialGradient id={`peakGlow-${goal.id}`} cx="50%" cy="0%" r="65%">
                            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.16" />
                            <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
                        </radialGradient>
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
                                .tos-pulse-ring { animation: tos-pulse-ring 2.2s ease-out infinite; transform-origin: center; }
                                .tos-pulse-core { animation: tos-pulse-core 2.2s ease-in-out infinite; transform-origin: center; }
                            `}
                        </style>
                    </defs>

                    {/* Atmosfera — cho'qqi tomon yorug'lik */}
                    <rect x="0" y="0" width="400" height="300" fill={`url(#peakGlow-${goal.id})`} />

                    {/* Orqa tizma — xira, chuqurlik uchun */}
                    <path
                        d={BACK_RIDGE}
                        fill="none"
                        stroke={colors.border}
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        opacity="0.45"
                    />

                    {/* Old tizma — asosiy silueti */}
                    <path
                        d={FRONT_RIDGE}
                        fill="none"
                        stroke={colors.text}
                        strokeWidth="1.75"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        opacity="0.75"
                    />

                    {/* Yo'lka */}
                    <path
                        d={TRAIL_D}
                        fill="none"
                        stroke={colors.primary}
                        strokeWidth="1.75"
                        strokeDasharray="1 6"
                        strokeLinecap="round"
                        opacity="0.8"
                    />

                    {/* Cho'qqidagi bayroq — Goal nomi */}
                    <line
                        x1={PEAK.x}
                        y1={PEAK.y}
                        x2={PEAK.x}
                        y2={PEAK.y - 30}
                        stroke={colors.text}
                        strokeWidth="1.5"
                        opacity="0.8"
                    />
                    <path
                        d={`M${PEAK.x},${PEAK.y - 30} L${PEAK.x + 20},${PEAK.y - 24} L${PEAK.x},${PEAK.y - 18} Z`}
                        fill={colors.primary}
                    />
                    <text
                        x={PEAK.x}
                        y={PEAK.y - 38}
                        textAnchor="middle"
                        fontSize="10.5"
                        fontWeight="700"
                        fill={colors.text}
                        opacity="0.85"
                    >
                        {goal.title.length > 28 ? goal.title.slice(0, 26) + "…" : goal.title}
                    </text>

                    {/* Har bir bosqich uchun belgi — sof SVG, tashqi ikonkasiz */}
                    {steps.map((step, i) => {
                        const t = (i + 1) / total;
                        const p = trailPoint(t);
                        const isNext = i === nextStepIndex;
                        return (
                            <g
                                key={step.id}
                                transform={`translate(${p.x}, ${p.y})`}
                                style={{ cursor: "pointer" }}
                                onClick={() => onToggleStep(goal.id, step.id)}
                            >
                                {isNext && (
                                    <circle r="9" fill="none" stroke={colors.primary} strokeWidth="1.5" className="tos-pulse-ring" />
                                )}
                                <circle
                                    r="6"
                                    fill={step.completed ? colors.success : colors.surface}
                                    stroke={step.completed ? colors.success : isNext ? colors.primary : colors.border}
                                    strokeWidth="1.75"
                                />
                                {step.completed && (
                                    <path
                                        d="M-2.6,0 L-0.6,2.2 L2.8,-2.4"
                                        fill="none"
                                        stroke="#fff"
                                        strokeWidth="1.4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                )}
                            </g>
                        );
                    })}

                    {/* "Siz hozir shu yerdasiz" — nafas oluvchi belgi */}
                    {total > 0 && (
                        <g transform={`translate(${currentPos.x}, ${currentPos.y})`}>
                            <circle r="9" fill="none" stroke={colors.primary} strokeWidth="1.5" className="tos-pulse-ring" />
                            <circle r="5.5" fill={colors.primary} className="tos-pulse-core" />
                            <circle r="2" fill="#fff" />
                        </g>
                    )}
                </svg>
            </MountainSvgBox>

            <StepList>
                {steps.map((step) => (
                    <StepRow key={step.id} onClick={() => onToggleStep(goal.id, step.id)}>
                        <StepCheck $done={step.completed}>
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
                        <StepTitle $done={step.completed}>{step.title}</StepTitle>
                        {step.stageLabel && <StepStage>{step.stageLabel}</StepStage>}
                    </StepRow>
                ))}
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

export default MountainScene;