import { DataTypes, Model } from 'sequelize';

export default class Promotion extends Model {
    static initialize(sequelize) {
        Promotion.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    primaryKey: true,
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                image: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                isOutput: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },
                endDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: 'Promotion',
                tableName: 'promotions',
            }
        );
    }
}
