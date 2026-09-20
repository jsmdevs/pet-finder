import { Router, Response, Request } from "express";
import { authMiddleware } from "../middlewares/authMiddlewate";
import ReportController from "../controllers/reportController";
import { sendRes } from "../utils/responseHelper";
import { messages } from "../utils/messages";

const router = Router();

router.post("/create", authMiddleware, async (req: Request, res: Response) => {
    try {
        const data = req.body;

        const timestamp = Date.now();
        const UserId = req._user?.id;

        if (UserId) {
            const result = await ReportController.create(data, timestamp, UserId);
            sendRes(res, result.message, result.success, result.status);
        };

    } catch (error: any) {
        sendRes(res, error.message, false, 500)
    };
});

router.post("/edit/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
        const idReport = req.params.id as string;
        const UserId = req._user?.id;
        const data = req.body;

        if (UserId) {
            const result = await ReportController.edit(data, UserId, idReport);
            sendRes(res, result.message, result.success, result.status);

        } else {
            sendRes(res, messages.internalError, false, 500);
        };


    } catch (error: any) {
        sendRes(res, error.message, false, 500);
    };
});

router.delete("/delete/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const UserId = req._user?.id;

        if (UserId) {
            const result = await ReportController.delete(id, UserId);
            sendRes(res, result.message, result.success, result.status);
        } else {
            sendRes(res, messages.userIdMissing, false, 403);
        };

    } catch (error: any) {
        sendRes(res, error.message, false, 500);
        
    };
});

export default router;