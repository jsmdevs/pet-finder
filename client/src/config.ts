const apiUrl = new URL(import.meta.env.VITE_API_URL);

if (import.meta.env.DEV) {
    apiUrl.hostname = window.location.hostname;
}

export const API_URL = apiUrl.toString().replace(/\/$/, "");