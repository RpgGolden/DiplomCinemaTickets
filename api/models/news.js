import { DataTypes, Model } from 'sequelize';

export default class News extends Model {
    static initialize(sequelize) {
        News.init(
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
                title: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                content: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                    validate: {
                        isBoolean: true,
                    },
                },
            },
            {
                sequelize,
                modelName: 'News',
                tableName: 'news',
            }
        );
    }
}
