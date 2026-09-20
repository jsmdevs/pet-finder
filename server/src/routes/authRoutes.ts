import { Router, Request, Response } from "express";
import crypto from "crypto";
import AuthController from "../controllers/authController";
import { sendRes } from "../utils/responseHelper";

const router = Router();
const SECRET = process.env.SECRET_SIGNATURE;

if (!SECRET) {
    throw new Error("La variable de entorno SECRET_SIGNATRE no está definida");
};

function getSHA256ofJSON(input: any) {
    return crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex');
};


router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, location, email } = req.body;
        const passwordHashed = getSHA256ofJSON(req.body.password);
        const result = await AuthController.register(name, location, email, passwordHashed);

        sendRes(res, result.message, result.success, result.status);

    } catch (error: any) {
        sendRes(res, error.message, false, 500);
    }
});

router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const passwordHashed = getSHA256ofJSON(password);
        const result = await AuthController.login(email, passwordHashed, SECRET);

        sendRes(res, result.message, result.success, result.status, result.token);

    } catch (error: any) {
        sendRes(res, error.message, false, 500);
    }
});

router.post("/restart_password", async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const passwordHashed = getSHA256ofJSON(req.body.password);
        const result = await AuthController.restartPassword(email, passwordHashed);

        sendRes(res, result.message, result.success, result.status);

    } catch (error: any) {
        sendRes(res, error.message, false, 500);
    }
});


export default router;


