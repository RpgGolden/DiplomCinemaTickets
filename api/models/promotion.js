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
                image: {
                    type: DataTypes.STRING,
                },
                description: {
                    type: DataTypes.TEXT,
                },
                discountPercentage: {
                    type: DataTypes.FLOAT,
                },
                conditions: {
                    type: DataTypes.TEXT,
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
