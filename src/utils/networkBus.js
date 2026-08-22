// Oddiy pub/sub — axios interceptorlari (React tashqarisida yashaydi) bilan
// MessagesProvider (React context, "antd message" orqali toast ko'rsatadi)
// o'rtasida ko'prik vazifasini bajaradi. Interceptor "pending/resolved/rejected"
// hodisalarini shu bus orqali chiqaradi, MessagesProvider ularga obuna bo'lib
// foydalanuvchiga tushuntiradi.
const listeners = new Map();

const on = (event, handler) => {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(handler);
    return () => {
        listeners.get(event)?.delete(handler);
    };
};

const emit = (event, payload) => {
    listeners.get(event)?.forEach((handler) => {
        try {
            handler(payload);
        } catch {
            // bitta listener xatoligi qolganlariga ta'sir qilmasin
        }
    });
};

export const networkBus = { on, emit };

export default networkBus;
