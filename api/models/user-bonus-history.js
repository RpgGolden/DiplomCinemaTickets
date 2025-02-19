import { DataTypes, Model } from 'sequelize';

export default class UserBonusHistory extends Model {
    static initialize(sequelize) {
        UserBonusHistory.init(
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
                changeAmount: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.STRING,
                },
                createdAt: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.NOW,
                },
            },
            {
                sequelize,
                modelName: 'UserBonusHistory',
                tableName: 'user_bonus_histories',
            }
        );
    }
}
