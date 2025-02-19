import { DataTypes, Model } from 'sequelize';

export default class UserBonus extends Model {
    static initialize(sequelize) {
        UserBonus.init(
            {
                userId: {
                    type: DataTypes.UUID,
                    references: {
                        model: 'users',
                        key: 'id',
                    },
                },
                bonusPoints: {
                    type: DataTypes.INTEGER,
                    defaultValue: 0,
                },
            },
            {
                sequelize,
                modelName: 'UserBonus',
                tableName: 'user_bonuses',
            }
        );
    }
}
