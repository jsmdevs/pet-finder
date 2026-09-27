const API_URL = "http://localhost:3000"; // ajustá según tu config

export async function checkAuth(): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/user/me`, {
            credentials: "include", // OBLIGATORIO para que mande la cookie
        });
        return res.ok; // 200 = sesión válida, 401 = no
    } catch {
        return false;
    }
}