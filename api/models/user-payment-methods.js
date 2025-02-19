import { DataTypes, Model } from 'sequelize';

export default class UserPaymentMethod extends Model {
    static initialize(sequelize) {
        UserPaymentMethod.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    primaryKey: true,
                },
                userId: {
                    type: DataTypes.UUID,
                    references: {
                        model: 'users',
                        key: 'id',
                    },
                },
                methodType: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                details: {
                    type: DataTypes.JSON, // Можно использовать JSON для хранения дополнительных данных о методе оплаты
                },
            },
            {
                sequelize,
                modelName: 'UserPaymentMethod',
                tableName: 'user_payment_methods',
            }
        );
    }
}
