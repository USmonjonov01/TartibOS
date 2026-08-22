// mockAPI'dagi routine/mission/weeks kolleksiyalarida ilgari userId maydoni
// bo'lmagan. Shu sabab eski yozuvlar (userId'siz) birinchi ro'yxatdan o'tgan
// foydalanuvchiga (id "1" — Azizbek) tegishli deb hisoblanadi. Yangi
// yaratiladigan har bir yozuvga esa har doim userId biriktiriladi, shunda
// yangi foydalanuvchilarning tarixi hech kimnikiga aralashmaydi.
const LEGACY_OWNER_ID = "1";

export const belongsToUser = (item, userId) => {
    if (!userId) return false;
    if (item?.userId !== undefined && item?.userId !== null) {
        return String(item.userId) === String(userId);
    }
    return String(userId) === LEGACY_OWNER_ID;
};

export const filterByOwner = (list, userId) =>
    Array.isArray(list) ? list.filter((item) => belongsToUser(item, userId)) : [];
