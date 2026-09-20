import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extendemos la interfaz Request de Express para que TypeScript reconozca _user
export interface AuthenticatedRequest extends Request {
    _user?: any;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Token de autorización no provisto" });
        }

        const token = authHeader.split(" ")[1];
        const SECRET = process.env.SECRET_SIGNATURE;

        if (!SECRET) {
            throw new Error("La variable de entorno SECRET_SIGNATURE no está definida");
        }

        const data = jwt.verify(token, SECRET);
        req._user = data;

        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
}