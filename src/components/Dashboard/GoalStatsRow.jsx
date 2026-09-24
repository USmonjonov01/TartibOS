import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mountain, Flame, Target } from "lucide-react";
import { tokens } from "../../theme/tokens";
import { useGoals, getGoalLevel, getGoalStage } from "../../context/goals";
import {
    StatPillRow,
    StatPill,
    LevelPillTrack,
    LevelPillCard,
    LevelPillIndex,
    PillIconBox,
    PillBody,
    PillValue,
    PillLabel,
} from "./style";

// Dashboard header'ining o'ng tomonida, salomlashuv matni bilan bitta qatorda
// (HeaderBlock'ning space-between'i orqali) turadigan pill'lar: Goal
// darajalari, kunlik streak, va bugungi missiyalar.
//
// Level qismi ENDI faqat "asosiy" Goal'ni emas — foydalanuvchining BARCHA
// faol Goal'larini ko'rsatadi. Har biri o'z mustaqil Level/unvoniga ega
// bo'lgani uchun (StaircaseScene'dagi kabi) bittasini orqa fonda
// qoldirib bo'lmaydi. Shu sabab bu qism o'zi ichida yon tomonga scroll
// bo'ladigan ixcham karuselga aylantirildi (LevelPillTrack, style.js).
//
// streakDays, missionsCompleted, missionsTotal — Dashboard'ning o'zida
// hisoblangan qiymatlar, qayta hisoblamaslik uchun prop sifatida uzatiladi.
function    GoalStatsRow({ streakDays, missionsCompleted = 0, missionsTotal = 0 }) {
    const navigate = useNavigate();
    const { goals, fetchGoals } = useGoals();

    useEffect(() => {
        fetchGoals().catch(() => {});
    }, [fetchGoals]);

    const activeGoals = (goals || [])
        .filter((g) => g.status !== "archived")
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const missionsTitle =
        missionsTotal === 0
            ? "Bugun uchun missiya yo'q"
            : `Bugungi missiyalar: ${missionsCompleted}/${missionsTotal} bajarildi`;

    return (
        <StatPillRow>
            <LevelPillTrack title="Barcha maqsadlaringiz — yon tomonga suring">
                {activeGoals.length === 0 ? (
                    <LevelPillCard $clickable onClick={() => navigate("/roadmap")} title="Yo'l xaritangizni boshlang">
                        <PillIconBox $bg={tokens.colors.amberSoft}>
                            <Mountain size={14} color={tokens.colors.amber} />
                        </PillIconBox>
                        <PillBody>
                            <PillValue>Level 1</PillValue>
                            <PillLabel>Daraja</PillLabel>
                        </PillBody>
                    </LevelPillCard>
                ) : (
                    activeGoals.map((goal, i) => {
                        const level = getGoalLevel(goal);
                        const stage = getGoalStage(goal);
                        return (
                            <LevelPillCard
                                key={goal.id}
                                $clickable
                                onClick={() => navigate("/roadmap")}
                                title={`${goal.title} — ${stage ? `Daraja: ${stage}` : "Yo'l xaritangizni boshlang"}`}
                            >
                                <PillIconBox $bg={tokens.colors.amberSoft}>
                                    <Mountain size={14} color={tokens.colors.amber} />
                                </PillIconBox>
                                <PillBody>
                                    <PillValue>Level {level}</PillValue>
                                    <PillLabel>{stage || goal.title}</PillLabel>
                                </PillBody>
                                {activeGoals.length > 1 && (
                                    <LevelPillIndex>
                                        {i + 1}/{activeGoals.length}
                                    </LevelPillIndex>
                                )}
                            </LevelPillCard>
                        );
                    })
                )}
            </LevelPillTrack>

            <StatPill title="TartibOS bilan — ro'yxatdan o'tgan kundan buyon izchil kunlar">
                <PillIconBox $bg={tokens.colors.amberSoft}>
                    <Flame size={14} color={tokens.colors.amber} />
                </PillIconBox>
                <PillBody>
                    <PillValue>{streakDays} kun</PillValue>
                    <PillLabel>Streak</PillLabel>
                </PillBody>
            </StatPill>

            <StatPill
                $clickable
                onClick={() => navigate("/missions")}
                title={missionsTitle}
            >
                <PillIconBox $bg={tokens.colors.amberSoft}>
                    <Target size={14} color={tokens.colors.amber} />
                </PillIconBox>
                <PillBody>
                    <PillValue>
                        {missionsCompleted}/{missionsTotal}
                    </PillValue>
                    <PillLabel>Missiya</PillLabel>
                </PillBody>
            </StatPill>
        </StatPillRow>
    );
}

export default GoalStatsRow;