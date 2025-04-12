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
                movieId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'movies',
                        key: 'id',
                    },
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
                isActive: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true,
                },
                repeatDaily: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                originalSessionId: {
                    type: DataTypes.INTEGER,
                    allowNull: true, // Это поле может быть пустым для оригинальной сессии
                    references: {
                        model: 'sessions',
                        key: 'id',
                    },
                    onDelete: 'CASCADE',
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
