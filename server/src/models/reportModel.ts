import { DataTypes, Model } from "sequelize";
import { sequelize } from '../../db/index'

export class Report extends Model { };

Report.init({
    name: DataTypes.STRING,
    reporterNumber: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING,
    location: DataTypes.STRING,
    timestamp: DataTypes.DATE,
    PetId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER

}, { sequelize, modelName: "Report" });