export const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
export const DAY_LABELS_UZ = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

const DAY_KEY_BY_JS_INDEX = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export const getDayKey = (date = new Date()) => DAY_KEY_BY_JS_INDEX[date.getDay()];

export const getDateStr = (date = new Date()) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

// ISO-8601 hafta raqami, "2026-W32" formatida — routine/weeks API'dagi weekId bilan mos
export const getISOWeekId = (date = new Date()) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
};

// Berilgan weekId (masalan "2026-W34") uchun o'sha haftaning DUSHANBA sanasini
// qaytaradi (mahalliy Date, ISO 8601: har bir yilning 4-yanvari doim 1-haftada
// bo'ladi — shu getISOWeekId bilan mos algoritm). Noto'g'ri format bo'lsa null.
export const getMondayOfISOWeek = (weekId) => {
    const match = /^(\d{4})-W(\d{2})$/.exec(weekId || "");
    if (!match) return null;
    const year = Number(match[1]);
    const week = Number(match[2]);

    const jan4 = new Date(year, 0, 4);
    const jan4Day = jan4.getDay() || 7; // Dush=1 ... Yak=7
    const mondayOfWeek1 = new Date(jan4);
    mondayOfWeek1.setDate(jan4.getDate() - (jan4Day - 1));

    const monday = new Date(mondayOfWeek1);
    monday.setDate(mondayOfWeek1.getDate() + (week - 1) * 7);
    monday.setHours(0, 0, 0, 0);
    return monday;
};

// Berilgan weekId va dayKey ("mon".."sun") uchun aniq kalendar sanasini qaytaradi.
// Haftalik tarix jadvalida har bir ustunga to'g'ri sanani chiqarish uchun kerak.
export const getDateForWeekDay = (weekId, dayKey) => {
    const monday = getMondayOfISOWeek(weekId);
    if (!monday) return null;
    const offset = DAY_ORDER.indexOf(dayKey);
    if (offset < 0) return null;
    const d = new Date(monday);
    d.setDate(monday.getDate() + offset);
    return d;
};