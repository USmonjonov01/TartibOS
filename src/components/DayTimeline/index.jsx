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

/**
 * items: [{ id, title, icon, start: "HH:MM", end?: "HH:MM", state: "done"|"missed"|"excused"|"pending" }]
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

    const segments = useMemo(() => {
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

    const activeItem = useMemo(
        () => segments.find((s) => nowMinutes >= s.startMin && nowMinutes < s.endMin) || null,
        [segments, nowMinutes]
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

            {segments.length === 0 ? (
                <EmptyRow>Bugungi odat va missiyalar uchun vaqt belgilanmagan</EmptyRow>
            ) : (
                <TrackWrap>
                    <NowMarker $left={nowLeft} />
                    <Track>
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
                        {segments.some((s) => s.state === "missed") && (
                            <LegendItem>
                                <LegendDot $color={colors.danger} />
                                <span>O'tkazib yuborilgan</span>
                            </LegendItem>
                        )}
                        {segments.some((s) => s.state === "excused") && (
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
