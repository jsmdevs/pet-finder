import { User, Auth } from "../models/models";
import jwt from 'jsonwebtoken';
import { sendMail } from "../services/email/mailServices";
import crypto from "crypto";

class AuthController {

    private static getSHA256ofJSON(input: any) {
        return crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex');
    };

    public static async register({ name, location, email, password }:
        {
            name: string,
            location: string,
            email: string,
            password: string
        }) {

        const passwordHashed = this.getSHA256ofJSON(password);
        const [user, created] = await User.findOrCreate({
            where: { email },
            defaults: {
                name,
                email,
                location,
            },
        });

        if (created) {
            await Auth.create({
                email,
                passwordHashed,
                UserId: user.get("id")
            });
            sendMail(email, "welcomeTemplate", name);
            return ({ success: true, status: 200, message: "El usuario se registró con éxito" });
        } else {
            return ({ success: false, status: 409, message: "El email ya se encuentra registrado" });
        };
    };

    public static async login({ email, password }:
        {
            email: string,
            password: string
        }) {

        const SECRET = process.env.SECRET_SIGNATURE;
        const passwordHashed = this.getSHA256ofJSON(password);

        if (!SECRET) {
            throw new Error("SECRET_SIGNATURE no está configurado");
        }

        const auth = await Auth.findOne({
            where: { email, password: passwordHashed }
        });

        if (auth) {
            const UserId = auth.get("UserId");
            const token = jwt.sign({ id: UserId }, SECRET);
            return ({ success: true, status: 200, message: "Logueado correctamente", token });
        } else {
            return ({ success: false, status: 401, message: "Email o contraseña incorrecta." });
        };
    };

    public static async restartPassword({ email, newPassword }:
        {
            email: string,
            newPassword: string
        }) {

        const userExist = await User.findOne({
            where: {
                email
            }
        });

        if (!userExist) {
            return ({ success: false, status: 404, message: "Usuario no encontrado" });
        };

        const UserId = userExist.get("id");
        const updatedPassword = await Auth.update(
            { newPassword },
            { where: { UserId } }
        );

        if (updatedPassword) {
            return ({ success: true, status: 200, message: "Contraseña actualizada con éxito" });
        } else {
            return ({ success: false, status: 500, message: "Error al cambiar la contraseña" });
        }
    }
};

export default AuthController;