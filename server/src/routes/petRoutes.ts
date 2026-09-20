import { Router, Response, Request } from "express";
import { authMiddleware } from "../middlewares/authMiddlewate";
import PetController from "../controllers/petController";
import { sendRes } from "../utils/responseHelper";
import { messages } from "../utils/messages";
import { success } from "zod";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const allPets = await PetController.getPets();
        sendRes(res, allPets.message, allPets.success, allPets.status, allPets.data);
    } catch (error: any) {
        sendRes(res, messages.internalError, false, 500);
    }
});

router.get("/nearby", authMiddleware, async (req: Request, res: Response) => {
    try {
        const data = req.params;

        const radius = Number(data.radius);
        const lat = Number(data.lat);
        const lng = Number(data.lng);

        const result = await PetController.nearby(radius, lat, lng);
        sendRes(res, result.message, result.success, result.status, result.data);
    } catch (error: any) {
        sendRes(res, messages.internalError, false, 500);
    }
});

router.post("/create", authMiddleware, async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const UserId = req._user?.id;

        if (UserId) {
            const result = await PetController.createPet(UserId, data);
            sendRes(res, result.message, result.success, result.status);
        } else {
            sendRes(res, messages.userIdMissing, false, 403);
        };

    } catch (error: any) {
        sendRes(res, messages.internalError, false, 500);
    };

});

router.put("/edit/:id", authMiddleware, async (req: Request, res: Response) => {

    try {
        const idPet = req.params.id as string;
        const UserId = req._user?.id;
        const data = req.body;

        if (UserId) {
            const result = await PetController.edit(data, UserId, idPet);
            sendRes(res, result.message, result.success, result.status);

        } else {
            sendRes(res, messages.internalError, false, 500);
        };


    } catch (error: any) {
        sendRes(res, messages.internalError, false, 500);
    };

});

router.delete("/delete/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const UserId = req._user?.id;

        if (UserId) {
            const result = await PetController.delete(id, UserId);
            sendRes(res, result.message, result.success, result.status);
        } else {
            sendRes(res, messages.userIdMissing, false, 403);
        };

    } catch (error: any) {
        sendRes(res, messages.internalError, false, 500);
    };
});

export default router;