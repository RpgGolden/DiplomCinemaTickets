import { DataTypes, Model } from 'sequelize';

export default class SeatPriceCategory extends Model {
    static initialize(sequelize) {
        SeatPriceCategory.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    primaryKey: true,
                },
                categoryName: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                price: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: 'SeatPriceCategory',
                tableName: 'seat_price_categories',
            }
        );
    }
}
