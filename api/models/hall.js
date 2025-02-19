import { DataTypes, Model } from 'sequelize';

export default class Hall extends Model {
    static initialize(sequelize) {
        Hall.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: 'Hall',
                tableName: 'halls',
            }
        );
    }
}
