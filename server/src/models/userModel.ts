import { DataTypes, Model } from "sequelize";
import { sequelize } from '../../db/index';

export class User extends Model { };

User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    location: DataTypes.STRING

}, { sequelize, modelName: "User" });


