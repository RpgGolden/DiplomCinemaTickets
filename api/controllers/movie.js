import path from 'path';
import Movie from '../models/movie.js';
import { AppErrorNotExist } from '../utils/errors.js';
import { MovieDto, MovieWithSessionsDto } from '../dtos/movie-dto.js';
import Session from '../models/session.js';
import moment from 'moment-timezone';
import Hall from '../models/hall.js';
import Seat from '../models/seat.js';
import SeatPriceCategory from '../models/seat-price-category.js';
import { Op } from 'sequelize';
import { deleteFromPinata, uploadToPinata } from '../ipfs-client/ipfsClient.js';
export default {
    async createMovie(req, res) {
        try {
            const {
                title,
                trailerVideo,
                duration,
                director,
                releaseDate,
                description,
                genres,
                ageRating,
                actors,
                typeFilm,
            } = req.body;
            const images = req.files ? req.files.map(file => path.posix.join('uploads', 'movies', file.filename)) : [];

            if (!title || !description || !duration || !trailerVideo) {
                throw new AppErrorNotExist('Не все данные заполнены');
            }

            const ipfsHashes = [];
            for (const image of images) {
                const pinataResponse = await uploadToPinata(image, 'movies', { category: 'Movie' });
                ipfsHashes.push(pinataResponse.IpfsHash);
            }

            const movie = await Movie.create({
                title,
                images: ipfsHashes,
                trailerVideo,
                duration,
                director,
                releaseDate,
                description,
                genres,
                ageRating,
                actors,
                typeFilm,
            });

            const movieDto = new MovieDto(movie, process.env.HOST);
            return res.json(movieDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    // Тута
    async getMovie(req, res) {
        try {
            const currentTime = moment().utc().add(3, 'hours');
            console.log(req.params.id);
            const movie = await Movie.findByPk(req.params.id, {
                include: [
                    {
                        model: Session,
                        include: [
                            {
                                model: Hall,
                            },
                            {
                                model: Seat,
                                include: [
                                    {
                                        model: SeatPriceCategory,
                                        attributes: ['categoryName', 'price'],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
            console.log(movie);
            if (!movie) {
                return res.status(404).json({ error: 'Movie not found' });
            }

            if (movie.Sessions) {
                // Фильтруем сессии, оставляя только будущие и активные
                movie.Sessions = movie.Sessions.filter(session => {
                    const sessionTime = moment(session.sessionTime);
                    return sessionTime.isAfter(currentTime) && session.isActive;
                });

                movie.Sessions.forEach(session => {
                    session.sessionTime = moment(session.sessionTime).format('YYYY-MM-DDTHH:mm');

                    if (session.Seats && session.Seats.length > 0) {
                        const firstSeat = session.Seats[0];
                        session.seatPrice = {
                            price: firstSeat.SeatPriceCategory ? firstSeat.SeatPriceCategory.price : null,
                            category: firstSeat.SeatPriceCategory ? firstSeat.SeatPriceCategory.categoryName : null,
                        };
                    } else {
                        session.seatPrice = null;
                    }
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
            const {
                title,
                trailerVideo,
                duration,
                director,
                releaseDate,
                description,
                genres,
                ageRating,
                actors,
                typeFilm,
            } = req.body;
            const newImages = req.files
                ? req.files.map(file => path.posix.join('uploads', 'movies', file.filename))
                : [];

            const movie = await Movie.findByPk(id);
            if (!movie) {
                return res.status(404).json({ error: 'Фильм не найден' });
            }

            // Если есть новые изображения, удаляем старые и загружаем новые
            if (newImages.length > 0) {
                for (const image of movie.images) {
                    await deleteFromPinata(image);
                }

                const newIpfsHashes = [];
                for (const image of newImages) {
                    const pinataResponse = await uploadToPinata(image, 'movies', { category: 'Movie' });
                    newIpfsHashes.push(pinataResponse.IpfsHash);
                }
                movie.images = newIpfsHashes;
            }

            // Обновляем данные фильма
            movie.title = title || movie.title;
            movie.trailerVideo = trailerVideo || movie.trailerVideo;
            movie.duration = duration || movie.duration;
            movie.director = director || movie.director;
            movie.releaseDate = releaseDate ? new Date(releaseDate) : movie.releaseDate;
            movie.description = description || movie.description;
            movie.genres = genres || movie.genres;
            movie.ageRating = ageRating || movie.ageRating;
            movie.actors = actors || movie.actors;
            movie.typeFilm = typeFilm || movie.typeFilm;

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
                    order: [['releaseDate', 'DESC']],
                    include: [{ model: Session, include: [Hall] }],
                });
                const moviesDto = movies.map(movie => new MovieWithSessionsDto(movie, process.env.HOST));
                return res.json(moviesDto);
            } else {
                const movies = await Movie.findAll({
                    order: [['releaseDate', 'DESC']],
                });
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

            // Delete images from Pinata
            for (const image of movie.images) {
                await deleteFromPinata(image);
            }

            await movie.destroy({ force: true });
            return res.json({ message: 'Фильм успешно удалён' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deleteMovies(req, res) {
        try {
            const movieIds = req.body.ids;

            if (!Array.isArray(movieIds) || movieIds.length === 0) {
                return res.status(400).json({ error: 'No movie IDs provided' });
            }

            const movies = await Movie.findAll({ where: { id: movieIds } });

            for (const movie of movies) {
                // Delete images from Pinata
                for (const image of movie.images) {
                    await deleteFromPinata(image);
                }
            }

            await Movie.destroy({ where: { id: movieIds }, force: true });
            return res.json({ message: 'Фильмы успешно удалены' });
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

    async findMovieByTitle(req, res) {
        try {
            const { title } = req.query;
            const movie = await Movie.findAll({
                where: {
                    title: {
                        [Op.iLike]: `%${title}%`,
                    },
                },
            });

            return res.json(movie);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getHits(req, res) {
        try {
            const currentDay = moment().format('YYYY-MM-DD');
            const nextThreeMovies = await Movie.findAll({
                limit: 5,
                where: {
                    releaseDate: {
                        [Op.lte]: currentDay,
                    },
                },
                order: [['releaseDate', 'DESC']],
            });

            const moviesDto = nextThreeMovies.map(movie => new MovieDto(movie, process.env.HOST));
            return res.json(moviesDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async comingSoon(req, res) {
        try {
            const currentDay = moment().format('YYYY-MM-DD');
            const nextThreeMovies = await Movie.findAll({
                where: {
                    releaseDate: {
                        [Op.gte]: currentDay,
                    },
                    typeFilm: 'premiere',
                },
                limit: 5,
                order: [['releaseDate', 'ASC']],
            });

            const moviesDto = nextThreeMovies.map(movie => new MovieDto(movie, process.env.HOST));
            return res.json(moviesDto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
