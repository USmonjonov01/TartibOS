import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mountain, Flame, Target } from "lucide-react";
import { tokens } from "../../theme/tokens";
import { useGoals, getGoalLevel, getGoalStage, getPrimaryGoal } from "../../context/goals";
import { StatPillRow, StatPill, PillIconBox, PillBody, PillValue, PillLabel } from "./style";

// Dashboard header'ining o'ng tomonida, salomlashuv matni bilan bitta qatorda
// (HeaderBlock'ning space-between'i orqali) turadigan uchta ixcham pill:
// Goal darajasi, kunlik streak, va bugungi missiyalar. Har biri "bir
// qarashda" o'qiladigan darajada kichik — katta Card emas, faqat
// icon + qiymat + mikro-label.
//
// streakDays, missionsCompleted, missionsTotal — Dashboard'ning o'zida
// hisoblangan qiymatlar, qayta hisoblamaslik uchun prop sifatida uzatiladi.
function    GoalStatsRow({ streakDays, missionsCompleted = 0, missionsTotal = 0 }) {
    const navigate = useNavigate();
    const { goals, fetchGoals } = useGoals();

    useEffect(() => {
        fetchGoals().catch(() => {});
    }, [fetchGoals]);

    const primaryGoal = getPrimaryGoal(goals);
    const level = primaryGoal ? getGoalLevel(primaryGoal) : 1;
    const stage = primaryGoal ? getGoalStage(primaryGoal) : null;

    const missionsTitle =
        missionsTotal === 0
            ? "Bugun uchun missiya yo'q"
            : `Bugungi missiyalar: ${missionsCompleted}/${missionsTotal} bajarildi`;

    return (
        <StatPillRow>
            <StatPill
                $clickable
                onClick={() => navigate("/roadmap")}
                title={stage ? `Daraja: ${stage}` : "Daraja — Yo'l xaritangizni boshlang"}
            >
                <PillIconBox $bg={tokens.colors.amberSoft}>
                    <Mountain size={14} color={tokens.colors.amber} />
                </PillIconBox>
                <PillBody>
                    <PillValue>Level {level}</PillValue>
                    <PillLabel>{stage || "Daraja"}</PillLabel>
                </PillBody>
            </StatPill>

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