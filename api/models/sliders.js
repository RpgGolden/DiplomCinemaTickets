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
                images: {
                    type: DataTypes.STRING,
                },
            },
            {
                sequelize,
                modelName: 'Slider',
                tableName: 'sliders',
            }
        );
    }
}
