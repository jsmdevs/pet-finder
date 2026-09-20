import { User } from "../models/models";

class UserController {
    public static async me(id: string) {
        const data = await User.findByPk(id);
        if (data) {
            return ({ status: 200, message: "Información recuperada con éxito", data });
        } else {
            return ({ status: 401, message: "Error al obtener los datos", data });
        };
    };
};

export default UserController;