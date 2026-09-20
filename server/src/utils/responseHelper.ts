import { Response } from "express";

export const sendRes = (res: Response, message: string, success: boolean, status = 200, data?: any,) => {
    return res.status(status).json({ success, status, message, data });
};
