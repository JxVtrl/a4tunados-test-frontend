import axios from "axios";

function getCookie(name: string) {
    if (typeof document === "undefined") return null
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(';').shift();
    return null;
}

const api = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:8000/api/",
});

// Interceptor para refresh automático do token
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.endsWith("token/") &&
            !originalRequest.url.endsWith("token/refresh/") &&
            getCookie("refresh_token")
        ) {
            originalRequest._retry = true;
            try {
                await api.post("token/refresh/");
                return api(originalRequest);
            } catch (refreshError) {
                // Limpa cookies manualmente (opcional)
                document.cookie = "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                document.cookie = "refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                // Redireciona para login e NÃO tenta novamente
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api; 