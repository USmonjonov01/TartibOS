import { createContext, useContext, useEffect } from "react";
import { App } from "antd";
import networkBus from "../../utils/networkBus";

const MessagesContext = createContext(null);

// MessagesProvider — API bilan integratsiya holatini (pending / resolve /
// reject) foydalanuvchiga tushuntiruvchi toast xabarlar. Har bir axios
// so'rovi src/axios/networkNotifier.js orqali networkBus'ga hodisa chiqaradi,
// bu yerda esa o'sha hodisalar antd `message` API'siga bog'lanadi.
//
// Bir xil `key` bilan ochilgan xabar avvalgisini almashtiradi — shu sabab
// "yuklanmoqda..." (loading) holati muvaffaqiyat/xatolikka aylanganda foydalanuvchi
// bitta xabar o'zgarayotganini ko'radi, ekran ustma-ust to'lib ketmaydi.
export const MessagesProvider = ({ children }) => {
    const { message } = App.useApp();

    useEffect(() => {
        const offPending = networkBus.on("pending", ({ id, text }) => {
            message.open({ key: id, type: "loading", content: text, duration: 0 });
        });
        const offResolved = networkBus.on("resolved", ({ id, text }) => {
            message.open({ key: id, type: "success", content: text, duration: 2 });
        });
        const offRejected = networkBus.on("rejected", ({ id, text }) => {
            message.open({ key: id, type: "error", content: text, duration: 4 });
        });

        return () => {
            offPending();
            offResolved();
            offRejected();
        };
    }, [message]);

    // Komponentlar ichida axios'dan tashqari holatlar uchun ham (masalan,
    // frontendda tekshirilgan validatsiya xatosi) qo'lda chaqirish imkoniyati.
    const notify = {
        pending: (text, key = `manual-${Date.now()}`) =>
            message.open({ key, type: "loading", content: text, duration: 0 }),
        success: (text, key) => message.open({ key, type: "success", content: text, duration: 2 }),
        error: (text, key) => message.open({ key, type: "error", content: text, duration: 4 }),
    };

    return <MessagesContext.Provider value={notify}>{children}</MessagesContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components -- context + hook birga joylashgan, bu keng tarqalgan pattern
export const useMessages = () => {
    const ctx = useContext(MessagesContext);
    if (!ctx) {
        throw new Error("useMessages faqat MessagesProvider ichida ishlatilishi kerak");
    }
    return ctx;
};
