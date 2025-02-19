import { DataTypes, Model } from 'sequelize';

export default class Seat extends Model {
    static initialize(sequelize) {
        Seat.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    primaryKey: true,
                },
                hallId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'halls',
                        key: 'id',
                    },
                },
                rowNumber: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                seatNumber: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                isAvailable: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true,
                },
            },
            {
                sequelize,
                modelName: 'Seat',
                tableName: 'seats',
            }
        );
    }
}
