import { Router, Request, Response } from "express";

import AuthController from "../controllers/authController";
import { sendRes } from "../utils/responseHelper";

const router = Router();


router.post('/register', async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const result = await AuthController.register(data);

        sendRes(res, result.message, result.success, result.status);

    } catch (error: any) {
        sendRes(res, error.message, false, 500);
    };
});

router.post("/login", async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const result = await AuthController.login(data);

        if (result.success && result.token) {
            res.cookie("token", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
            });
        };

        sendRes(res, result.message, result.success, result.status);

    } catch (error: any) {
        sendRes(res, error.message, false, 500);
    };
});

router.post("/restart_password", async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const result = await AuthController.restartPassword(data);

        sendRes(res, result.message, result.success, result.status);

    } catch (error: any) {
        sendRes(res, error.message, false, 500);
    }
});

router.post("/logout", (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    
    sendRes(res, "Sesión cerrada", true, 200);
});


export default router;


