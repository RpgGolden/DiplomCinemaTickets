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
            },
            {
                sequelize,
                modelName: 'Session',
                tableName: 'sessions',
            }
        );
    }
}
