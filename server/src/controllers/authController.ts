import { User, Auth } from "../models/models";
import jwt from 'jsonwebtoken';
import { sendMail } from "../services/email/mailServices";

class AuthController {

    public static async register(name: string, location: string, email: string, password: string) {
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
                password,
                UserId: user.get("id")
            });
            sendMail(email, "welcomeTemplate", name);
            return ({ success: true, status: 200, message: "El usuario se registró con éxito" });
        } else {
            return ({ success: false, status: 409, message: "El email ya se encuentra registrado" });
        };
    };

    public static async login(email: string, password: string, SECRET: string) {
        const auth = await Auth.findOne({
            where: { email, password: password }
        });

        if (auth) {
            const UserId = auth.get("UserId");
            const token = { token: jwt.sign({ id: UserId }, SECRET) };
            return ({ success: true, status: 200, message: "Logueado correctamente", token });
        } else {
            return ({ success: false, status: 401, message: "Email o contraseña incorrecta." });
        };
    };

    public static async restartPassword(email: string, password: string) {
        const userExist = await User.findOne({
            where: {
                email
            }
        });

        if (!userExist) {
            return ({ success: false, status: 404, message: "Usuario no encontrado" });
        };

        const UserId = userExist.get("id");

        const newPassword = await Auth.update(
            { password },
            { where: { UserId } }
        );

        if (newPassword) {
            return ({ success: true, status: 200, message: "Contraseña actualizada con éxito" });
        } else {
            return ({ success: false, status: 500, message: "Error al cambiar la contraseña" });
        }
    }
};

export default AuthController;