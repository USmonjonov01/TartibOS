import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Mountain, ChevronRight } from "lucide-react";
import { tokens } from "../../theme/tokens";
import { useGoals } from "../../context/goals";

const Card = styled.button`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 22px;
    margin-bottom: 24px;
    border-radius: ${tokens.radius.lg};
    border: 1px solid ${tokens.colors.hairline};
    background: ${tokens.colors.surface};
    cursor: pointer;
    text-align: left;

    &:hover {
        background: ${tokens.colors.surfaceRaised};
    }
`;

const IconBox = styled.div`
    width: 44px;
    height: 44px;
    border-radius: 50%;
    flex: 0 0 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${tokens.colors.amberSoft};
`;

const LevelNum = styled.div`
    font-family: ${tokens.font.display};
    font-size: 20px;
    font-weight: 700;
    color: ${tokens.colors.textPrimary};
`;

const StageLabel = styled.div`
    font-size: 12.5px;
    color: ${tokens.colors.textSecondary};
    margin-top: 1px;
`;

// Foydalanuvchining eng so'nggi bajargan bosqichi unvonini topadi — bu
// dashboard'da "Level 17 — Junior Frontend Developer" ko'rinishida ko'rsatiladi.
const findCurrentStage = (goals) => {
    const completedSteps = goals
        .flatMap((g) => g.steps || [])
        .filter((s) => s.completed && s.completedAt)
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    return completedSteps[0]?.stageLabel || null;
};

function LevelCard() {
    const navigate = useNavigate();
    const { goals, level, fetchGoals } = useGoals();

    useEffect(() => {
        fetchGoals().catch(() => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchGoals]);

    const stage = useMemo(() => findCurrentStage(goals), [goals]);

    return (
        <Card onClick={() => navigate("/roadmap")}>
            <IconBox>
                <Mountain size={20} color={tokens.colors.amber} />
            </IconBox>
            <div style={{ flex: 1 }}>
                <LevelNum>Level {level}</LevelNum>
                <StageLabel>{stage || "Yo'l xaritangizni boshlang"}</StageLabel>
            </div>
            <ChevronRight size={16} color={tokens.colors.textSecondary} />
        </Card>
    );
}

export default LevelCard;