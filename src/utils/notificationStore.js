// Bildirishnomalar bir marta ko'rsatilishi kerak bo'lgan hodisalar uchun
// (missiya vaqti keldi, odat muddati o'tdi, Level Up) sahifa yangilansa ham
// takror chiqmasligi uchun kichik localStorage asosidagi "ko'rilganlar" ombori.

const SEEN_KEY = "tartibos_notified_keys_v1";
const HISTORY_PREFIX = "tartibos_notif_history_v1";
const MAX_SEEN = 400;
const MAX_HISTORY = 30;

export const loadSeenKeys = () => {
    try {
        const raw = JSON.parse(localStorage.getItem(SEEN_KEY));
        return new Set(Array.isArray(raw) ? raw : []);
    } catch {
        return new Set();
    }
};

export const saveSeenKeys = (set) => {
    try {
        localStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(set).slice(-MAX_SEEN)));
    } catch {
        // localStorage yo'q yoki to'lgan bo'lsa jim o'tkazamiz — bildirishnoma
        // baribir shu sessiyada bir marta chiqadi, faqat refreshdan keyin qayta chiqishi mumkin
    }
};

export const loadHistory = (userId) => {
    try {
        const raw = JSON.parse(localStorage.getItem(`${HISTORY_PREFIX}:${userId}`));
        return Array.isArray(raw) ? raw : [];
    } catch {
        return [];
    }
};

export const saveHistory = (userId, history) => {
    try {
        localStorage.setItem(`${HISTORY_PREFIX}:${userId}`, JSON.stringify(history.slice(0, MAX_HISTORY)));
    } catch {
        // xotira to'lgan bo'lsa e'tiborsiz qoldiramiz
    }
};
