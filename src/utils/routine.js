import { getDayKey } from "./date";

// Odatning barqaror identifikatori — nomiga asoslangan (id emas). id noturg'un,
// chunki dublikat yozuvlar orasidan "g'olib" tanlash createdAt'ga bog'liq va
// yangi dublikat qo'shilsa o'zgarishi mumkin. title esa doim bir xil qoladi.
export const habitKey = (item) => item?.title?.trim().toLowerCase() || item?.id;

// routine kolleksiyasida bir xil odat bir necha marta (versiyalanган holda yoki
// tasodifiy takror) yaratilgan bo'lishi mumkin. Har bir noyob sarlavha uchun
// eng oxirgi yaratilgan (createdAt) yozuvni saqlab qolamiz, qolganini yashiramiz.
export const dedupeRoutines = (routines) => {
    const active = (routines || []).filter((item) => !item.retired);
    const byTitle = new Map();

    active.forEach((item) => {
        const key = habitKey(item);
        if (!key) return;

        const existing = byTitle.get(key);
        if (!existing) {
            byTitle.set(key, item);
            return;
        }

        const existingTime = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
        const itemTime = item.createdAt ? new Date(item.createdAt).getTime() : 0;
        if (itemTime >= existingTime) {
            byTitle.set(key, item);
        }
    });

    return Array.from(byTitle.values());
};

// Berilgan dayKey ("mon".."sun") kuniga tegishli, faol odatlar ro'yxati,
// boshlanish vaqti bo'yicha saralangan. getTodayHabits shu funksiyaning
// "bugun"ga qotirilgan holati — Haftalik tarix sahifasida esa istalgan kun
// uchun kerak bo'ladi (orqaga qaytib to'ldirish imkoniyati uchun).
export const getHabitsForDay = (routines, dayKey) =>
    dedupeRoutines(routines)
        .filter((item) => !item.days || item.days.length === 0 || item.days.includes(dayKey))
        .sort((a, b) => (a.start || "").localeCompare(b.start || ""));

// Bugungi kunga tegishli, faol odatlar ro'yxati, boshlanish vaqti bo'yicha saralangan
export const getTodayHabits = (routines, date = new Date()) =>
    getHabitsForDay(routines, getDayKey(date));