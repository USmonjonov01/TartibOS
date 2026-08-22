import axios from "axios";
import { attachNetworkNotifier } from "./networkNotifier";

const attachAuthInterceptor = (apiInstance) => {
    apiInstance.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
};

// Foydalanuvchi ro'yxatdan o'tishi / kirishi uchun
export const authApi = axios.create({
    baseURL: import.meta.env.VITE_API,
});
attachAuthInterceptor(authApi);
attachNetworkNotifier(authApi, "Hisob");

// Routine (odatlar) va haftalik statuslar uchun
export const routineApi = axios.create({
    baseURL: import.meta.env.VITE_API_ROUTINE,
});
attachAuthInterceptor(routineApi);
attachNetworkNotifier(routineApi, (config) =>
    (config.url || "").includes("/weeks") ? "Haftalik holat" : "Odat"
);

// Missiyalar va kunlik review uchun
export const missionApi = axios.create({
    baseURL: import.meta.env.VITE_API_MISSIONS,
});
attachAuthInterceptor(missionApi);
attachNetworkNotifier(missionApi, "Missiya");

export const dailyReviewApi = axios.create({
    baseURL: import.meta.env.VITE_API_DAILYREVIEW,
});
attachAuthInterceptor(dailyReviewApi);
attachNetworkNotifier(dailyReviewApi, "Kunlik xulosa");

export default authApi;
