import networkBus from "../utils/networkBus";

// Har bir HTTP metod uchun o'zbekcha fe'llar — "resurs nomi + fe'l" ko'rinishida
// xabar hosil qilinadi (masalan "Missiya yaratilmoqda...", "Odat o'chirildi").
const METHOD_VERBS = {
    get: { pending: "yuklanmoqda", done: "yuklandi", fail: "yuklashda xatolik" },
    post: { pending: "yaratilmoqda", done: "yaratildi", fail: "yaratishda xatolik" },
    put: { pending: "yangilanmoqda", done: "yangilandi", fail: "yangilashda xatolik" },
    patch: { pending: "yangilanmoqda", done: "yangilandi", fail: "yangilashda xatolik" },
    delete: { pending: "o'chirilmoqda", done: "o'chirildi", fail: "o'chirishda xatolik" },
};

let seq = 0;
const nextId = () => `net-${Date.now()}-${++seq}`;

const resolveLabel = (resourceLabel, config) =>
    typeof resourceLabel === "function" ? resourceLabel(config) : resourceLabel;

/**
 * Berilgan axios instance'ga so'rov holatini kuzatuvchi interceptorlarni
 * ulaydi. Har bir so'rov "pending" (jo'natildi) -> "resolved" (muvaffaqiyatli)
 * yoki "rejected" (xatolik) hodisalarini networkBus orqali chiqaradi.
 *
 * GET so'rovlari sukut bo'yicha "silent" (jim) — sahifa har safar
 * ochilganda fon rejimida ma'lumot yuklanadi, buni har safar toast bilan
 * ko'rsatish ortiqcha shovqin bo'lardi. Lekin GET muvaffaqiyatsiz bo'lsa,
 * xatolik baribir ko'rsatiladi — foydalanuvchi tarmoq muammosidan xabardor
 * bo'lishi kerak.
 *
 * Har bir chaqiruvda `config.meta = { label, silent }` orqali sukut
 * qiymatlarni ustidan yozish mumkin (masalan, kirish/ro'yxatdan o'tish kabi
 * muhim harakatlar uchun aniqroq matn berish).
 */
export const attachNetworkNotifier = (instance, resourceLabel, { silentGet = true } = {}) => {
    instance.interceptors.request.use((config) => {
        const method = (config.method || "get").toLowerCase();
        const meta = config.meta || {};
        const silent = meta.silent ?? (silentGet && method === "get");
        const id = nextId();

        config.meta = { ...meta, id, silent, method };

        if (!silent) {
            const verbs = METHOD_VERBS[method] || METHOD_VERBS.get;
            const label = meta.label || resolveLabel(resourceLabel, config);
            networkBus.emit("pending", { id, text: `${label} ${verbs.pending}...` });
        }

        return config;
    });

    instance.interceptors.response.use(
        (response) => {
            const meta = response.config?.meta || {};
            if (!meta.silent) {
                const verbs = METHOD_VERBS[meta.method] || METHOD_VERBS.get;
                const label = meta.label || resolveLabel(resourceLabel, response.config);
                networkBus.emit("resolved", { id: meta.id, text: `${label} ${verbs.done}` });
            }
            return response;
        },
        (error) => {
            const config = error.config || {};
            const meta = config.meta || {};
            const verbs = METHOD_VERBS[meta.method] || METHOD_VERBS.get;
            const label = meta.label || resolveLabel(resourceLabel, config);
            const serverMessage = error.response?.data?.message;
            const text = serverMessage
                ? `${label}: ${serverMessage}`
                : error.message === "Network Error"
                    ? `${label}: internetga ulanishda muammo`
                    : `${label} ${verbs.fail}`;

            // Xatoliklar "silent" GET bo'lsa ham har doim ko'rsatiladi.
            networkBus.emit("rejected", { id: meta.id || nextId(), text });
            return Promise.reject(error);
        }
    );

    return instance;
};

export default attachNetworkNotifier;
