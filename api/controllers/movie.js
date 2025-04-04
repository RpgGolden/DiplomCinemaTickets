import path from 'path';
import Movie from '../models/movie.js';
import { AppErrorNotExist } from '../utils/errors.js';
import { MovieDto, MovieWithSessionsDto } from '../dtos/movie-dto.js';
import Session from '../models/session.js';
import moment from 'moment-timezone';
import Hall from '../models/hall.js';
export default {
    async createMovie(req, res) {
        try {
            const { title, trailerVideo, duration, director, releaseDate, description, genres, ageRating, actors } =
                req.body;
            const images = req.files ? req.files.map(file => path.posix.join('uploads', 'movies', file.filename)) : [];

            if (!title || !description || !duration || !trailerVideo) {
                throw new AppErrorNotExist('Не все данные заполнены');
            }

            const movie = await Movie.create({
                title,
                images, // Сохраняем массив изображений
                trailerVideo, // Сохраняем трейлер видео
                duration,
                director,
                releaseDate,
                description,
                genres,
                ageRating,
                actors,
            });

            const movieDto = new MovieDto(movie, process.env.HOST);
            return res.json(movieDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getMovie(req, res) {
        try {
            const movie = await Movie.findByPk(req.params.id, {
                include: [
                    {
                        model: Session,
                        include: [{ model: Hall }],
                    },
                ],
            });
            if (!movie) {
                return res.status(404).json({ error: 'Movie not found' });
            }

            if (movie.Sessions) {
                movie.Sessions.forEach(session => {
                    session.sessionTime = moment(session.sessionTime).format('YYYY-MM-DDTHH:mm');
                });
            }

            const movieDto = new MovieWithSessionsDto(movie, process.env.HOST);
            return res.json(movieDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async updateMovie(req, res) {
        try {
            const { id } = req.params;
            const { title, trailerVideo, duration, director, releaseDate, description, genres, ageRating, actors } =
                req.body;
            const images = req.files ? req.files.map(file => path.posix.join('uploads', 'movies', file.filename)) : [];

            const movie = await Movie.findByPk(id);
            if (!movie) {
                return res.status(404).json({ error: 'Фильм не найден' });
            }

            movie.title = title || movie.title;
            movie.trailerVideo = trailerVideo || movie.trailerVideo;
            movie.duration = duration || movie.duration;
            movie.director = director || movie.director;
            movie.releaseDate = releaseDate ? new Date(releaseDate) : movie.releaseDate;
            movie.description = description || movie.description;
            movie.genres = genres || movie.genres;
            movie.ageRating = ageRating || movie.ageRating;
            movie.actors = actors || movie.actors;
            movie.images = images || movie.images;

            await movie.save();
            const movieDto = new MovieDto(movie, process.env.HOST);
            return res.json(movieDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error', message: 'Ошибка при обновлении фильма' });
        }
    },

    async getAllMovies(req, res) {
        try {
            const withSession = req.query.withSession;

            if (withSession === 'true') {
                const movies = await Movie.findAll({
                    include: [{ model: Session, include: [Hall] }],
                });
                const moviesDto = movies.map(movie => new MovieWithSessionsDto(movie, process.env.HOST));
                return res.json(moviesDto);
            } else {
                const movies = await Movie.findAll();
                const moviesDto = movies.map(movie => new MovieDto(movie, process.env.HOST));
                return res.json(moviesDto);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deleteMovie(req, res) {
        try {
            const movie = await Movie.findByPk(req.params.id);
            if (!movie) {
                return res.status(404).json({ error: 'Movie not found' });
            }

            await movie.destroy({
                force: true,
            });
            return res.json({ message: 'Movie deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getMovieWithSessions(req, res) {
        try {
            const movie = await Movie.findByPk(req.params.id, { include: 'sessions' });
            if (!movie) {
                return res.status(404).json({ error: 'Movie not found' });
            }
            return res.json(movie);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    
};
