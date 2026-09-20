import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../db/index";

export class Auth extends Model { };

Auth.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    UserId: DataTypes.INTEGER
},
    { sequelize, modelName: "Auth" }
);