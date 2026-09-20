import { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares/authMiddlewate";
import UserController from "../controllers/userControllet";

const router = Router();

router.get("/me", authMiddleware, async (req: any, res: any) => {
    try {
        const id = req._user.id;
        const result = await UserController.me(id);
        res.status(result.status).json(result);

    } catch (error: any) {
        res.status(500).json(error)
    };

});

export default router;