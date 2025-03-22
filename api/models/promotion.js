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
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        min: 0,
                        max: 100,
                        isNumeric: true,
                    },
                },
                conditions: {
                    type: DataTypes.TEXT,
                },
                startDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    validate: {
                        isDate: true,
                    },
                },
                endDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    validate: {
                        isDate: true,
                    },
                },
                status: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                    validate: {
                        isBoolean: true,
                    },
                },
                ticketOffer: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                ticketCount: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
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
