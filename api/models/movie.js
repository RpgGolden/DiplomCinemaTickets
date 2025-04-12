import { DataTypes, Model } from 'sequelize';
export default class Movie extends Model {
    static initialize(sequelize) {
        Movie.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    primaryKey: true,
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                images: {
                    type: DataTypes.ARRAY(DataTypes.STRING),
                },
                trailerVideo: {
                    type: DataTypes.STRING,
                },
                duration: {
                    type: DataTypes.INTEGER,
                },
                director: {
                    type: DataTypes.STRING,
                },
                releaseDate: {
                    type: DataTypes.DATEONLY,
                },
                description: {
                    type: DataTypes.TEXT,
                },
                genres: {
                    type: DataTypes.ARRAY(DataTypes.STRING),
                },
                ageRating: {
                    type: DataTypes.STRING,
                },
                actors: {
                    type: DataTypes.ARRAY(DataTypes.STRING),
                },
                typeFilm: {
                    type: DataTypes.ENUM('premiere', 'base_movie'),
                    allowNull: true
                }
            },
            {
                sequelize,
                modelName: 'Movie',
                tableName: 'movies',
            }
        );
    }
}
