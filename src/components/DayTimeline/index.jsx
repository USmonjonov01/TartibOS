import { useEffect, useMemo, useState } from "react";
import {
    Card,
    Head,
    TitleBlock,
    Title,
    NowCaption,
    ClockBlock,
    ClockValue,
    ClockDate,
    LaneGroup,
    LaneLabel,
    TrackWrap,
    Track,
    Segment,
    NowMarker,
    TickRow,
    Tick,
    LegendRow,
    LegendItem,
    LegendDot,
    EmptyRow,
    colors,
} from "./style";

const HOUR_TICKS = [0, 6, 12, 18];
const DEFAULT_DURATION_MIN = 30; // Tugash vaqti ko'rsatilmagan band uchun

const toMinutes = (hhmm) => {
    if (!hhmm || typeof hhmm !== "string" || !hhmm.includes(":")) return null;
    const [h, m] = hhmm.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
};

const stateColor = (state) => {
    if (state === "done") return colors.success;
    if (state === "missed") return colors.danger;
    if (state === "excused") return colors.muted;
    return colors.primary; // pending
};

const stateLabel = (state) => {
    if (state === "done") return "Bajarildi";
    if (state === "missed") return "O'tkazib yuborilgan";
    if (state === "excused") return "Sababli bekor qilingan";
    return "Kutilmoqda";
};

// Vaqti to'qnashgan itemlarni avtomatik bir necha "qator"ga (lane) taqsimlaydi
// — klassik greedy interval-scheduling algoritmi. Har bir lane — oxirgi
// qo'shilgan itemning tugash vaqti. Yangi item shu vaqtdan keyin boshlansa,
// o'sha lane'ga qo'shiladi; aks holda yangi lane ochiladi. Natijada odatda
// 1 ta lane yetarli, faqat vaqti chindan to'qnashganda 2-, 3-lane paydo bo'ladi.
const packIntoLanes = (segments) => {
    const lanesEnd = []; // har bir lane'ning oxirgi itemi tugagan daqiqasi
    const lanes = [];

    [...segments]
        .sort((a, b) => a.startMin - b.startMin)
        .forEach((seg) => {
            let laneIndex = lanesEnd.findIndex((end) => end <= seg.startMin);
            if (laneIndex === -1) {
                laneIndex = lanesEnd.length;
                lanes.push([]);
            }
            lanesEnd[laneIndex] = seg.endMin;
            lanes[laneIndex].push(seg);
        });

    return lanes;
};

/**
 * items: [{ id, title, icon, start: "HH:MM", end?: "HH:MM", state, type: "habit"|"mission" }]
 *
 * Qatorlar: tepada missiyalar (odatda 1 qator), pastda odatlar — agar ikkita
 * odat vaqti to'qnashsa, odatlar guruhi ichida avtomatik qo'shimcha qator
 * ochiladi. Shu orqali "hozir aynan qaysi odat/missiya payti" hech qachon
 * bulanib ketmaydi.
 */
const DayTimeline = ({ items = [], title = "Kun jarayoni" }) => {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 30_000);
        return () => clearInterval(id);
    }, []);

    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const nowLeft = (nowMinutes / 1440) * 100;
    const clockText = now.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit", hour12: false });
    const dateText = now.toLocaleDateString("uz-UZ", { day: "2-digit", month: "short" });

    const allSegments = useMemo(() => {
        return (items || [])
            .map((item) => {
                const start = toMinutes(item.start);
                if (start === null) return null;
                const rawEnd = toMinutes(item.end);
                const end = rawEnd !== null && rawEnd > start ? rawEnd : Math.min(start + DEFAULT_DURATION_MIN, 1440);
                return { ...item, startMin: start, endMin: end };
            })
            .filter(Boolean)
            .sort((a, b) => a.startMin - b.startMin);
    }, [items]);

    const missionLanes = useMemo(
        () => packIntoLanes(allSegments.filter((s) => s.type === "mission")),
        [allSegments]
    );
    const habitLanes = useMemo(
        () => packIntoLanes(allSegments.filter((s) => s.type !== "mission")),
        [allSegments]
    );

    const activeItem = useMemo(
        () => allSegments.find((s) => nowMinutes >= s.startMin && nowMinutes < s.endMin) || null,
        [allSegments, nowMinutes]
    );

    const renderLane = (segments, laneIdx) => (
        <Track key={laneIdx}>
            {segments.map((s) => (
                <Segment
                    key={s.id}
                    $left={(s.startMin / 1440) * 100}
                    $width={Math.max(((s.endMin - s.startMin) / 1440) * 100, 0.4)}
                    $color={stateColor(s.state)}
                    $isNow={s === activeItem}
                    title={`${s.title} · ${s.start}${s.end ? "–" + s.end : ""} · ${stateLabel(s.state)}`}
                />
            ))}
        </Track>
    );

    return (
        <Card>
            <Head>
                <TitleBlock>
                    <Title>{title}</Title>
                    <NowCaption $idle={!activeItem} title={activeItem ? `${activeItem.start}–${activeItem.end}` : undefined}>
                        {activeItem
                            ? `Hozir: ${activeItem.icon ? activeItem.icon + " " : ""}${activeItem.title}`
                            : "Hozirgi soatga reja belgilanmagan"}
                    </NowCaption>
                </TitleBlock>
                <ClockBlock>
                    <ClockValue>{clockText}</ClockValue>
                    <ClockDate>{dateText}</ClockDate>
                </ClockBlock>
            </Head>

            {allSegments.length === 0 ? (
                <EmptyRow>Bugungi odat va missiyalar uchun vaqt belgilanmagan</EmptyRow>
            ) : (
                <TrackWrap>
                    <NowMarker $left={nowLeft} />

                    {missionLanes.length > 0 && (
                        <LaneGroup>
                            <LaneLabel>Missiyalar</LaneLabel>
                            {missionLanes.map((lane, i) => renderLane(lane, `m${i}`))}
                        </LaneGroup>
                    )}

                    {habitLanes.length > 0 && (
                        <LaneGroup>
                            <LaneLabel>Odatlar</LaneLabel>
                            {habitLanes.map((lane, i) => renderLane(lane, `h${i}`))}
                        </LaneGroup>
                    )}

                    <TickRow>
                        {HOUR_TICKS.map((h, i) => (
                            <Tick key={h} $left={(h / 24) * 100} $edge={i === 0 ? "start" : "mid"}>
                                {String(h).padStart(2, "0")}
                            </Tick>
                        ))}
                        <Tick $left={100} $edge="end">24</Tick>
                    </TickRow>

                    <LegendRow>
                        <LegendItem>
                            <LegendDot $color={colors.primary} />
                            <span>Kutilmoqda</span>
                        </LegendItem>
                        <LegendItem>
                            <LegendDot $color={colors.success} />
                            <span>Bajarildi</span>
                        </LegendItem>
                        {allSegments.some((s) => s.state === "missed") && (
                            <LegendItem>
                                <LegendDot $color={colors.danger} />
                                <span>O'tkazib yuborilgan</span>
                            </LegendItem>
                        )}
                        {allSegments.some((s) => s.state === "excused") && (
                            <LegendItem>
                                <LegendDot $color={colors.muted} />
                                <span>Sababli</span>
                            </LegendItem>
                        )}
                    </LegendRow>
                </TrackWrap>
            )}
        </Card>
    );
};

export default DayTimeline;