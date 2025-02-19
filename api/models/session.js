import { DataTypes, Model } from 'sequelize';

export default class Session extends Model {
    static initialize(sequelize) {
        Session.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    primaryKey: true,
                },
                movieTitle: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.TEXT,
                },
                actors: {
                    type: DataTypes.ARRAY(DataTypes.STRING),
                },
                hallId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'halls',
                        key: 'id',
                    },
                },
                sessionTime: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                createdAt: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.NOW,
                },
            },
            {
                sequelize,
                modelName: 'Session',
                tableName: 'sessions',
            }
        );
    }
}
