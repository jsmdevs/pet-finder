import { Model, DataTypes } from "sequelize";
import { sequelize } from '../../db/index'

export class Pet extends Model { }

Pet.init(
    {
        name: DataTypes.STRING,
        status: {
            type: DataTypes.ENUM('lost', 'found'),
        },
        location: DataTypes.STRING,
        imageUrl: DataTypes.STRING,
        UserId: DataTypes.INTEGER,
    },
    {
        sequelize,
        modelName: 'Pet',
    }
);