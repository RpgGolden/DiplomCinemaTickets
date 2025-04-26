import { DataTypes, Model } from 'sequelize';

export default class Slider extends Model {
    static initialize(sequelize) {
        Slider.init(
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
                priority: {
                    type: DataTypes.INTEGER,
                    allowNull: true
                },
                status: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false
                }
            },
            {
                sequelize,
                modelName: 'Slider',
                tableName: 'sliders',
            }
        );
    }
}
