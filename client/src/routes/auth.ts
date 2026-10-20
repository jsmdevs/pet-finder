import { API_URL } from "../config";
import axios from "axios";

export async function checkAuth() {
    try {
        const res = await axios.get(`${API_URL}/user/me`, {
            withCredentials: true,
        });
        return res.data.success; // 200 = sesión válida, 401 = no

    } catch {
        return false;
    }
}