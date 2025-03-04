import Hall from '../models/hall.js';
import Seat from '../models/seat.js';
import HallDto from '../dtos/hall-dto.js';
import SeatPriceCategory from '../models/seat-price-category.js';
import Session from '../models/session.js';
import Movie from '../models/movie.js';
import removeTimeZone from '../utils/removetimezone.js';

export default {
    async createHall(req, res) {
        const { hallName, rowNumber, seatNumber, categoryName, price } = req.body;

        try {
            const hall = await Hall.create({ name: hallName });

            const seatPriceCategory = await SeatPriceCategory.create({
                categoryName,
                price,
            });
            await seatPriceCategory.reload();
            const seatPromises = [];
            for (let row = 1; row <= rowNumber; row++) {
                for (let seat = 1; seat <= seatNumber; seat++) {
                    seatPromises.push(
                        Seat.create({
                            hallId: hall.id,
                            rowNumber: row,
                            seatNumber: seat,
                            isAvailable: true,
                            seatPriceCategoryId: seatPriceCategory.id,
                        })
                    );
                }
            }

            await Promise.all(seatPromises);

            const seats = await Seat.findAll({
                where: { hallId: hall.id },
                include: [SeatPriceCategory],
                order: [
                    ['rowNumber', 'ASC'],
                    ['seatNumber', 'ASC'],
                ],
            });

            const hallDto = new HallDto(hall, seats);
            res.json(hallDto);
        } catch (error) {
            console.error('Error creating hall with seats:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getHalls(req, res) {
        try {
            const halls = await Hall.findAll();

            for (const hall of halls) {
                const seats = await Seat.findAll({
                    where: { hallId: hall.id },
                    include: [SeatPriceCategory],
                    order: [
                        ['id', 'ASC'],
                        ['rowNumber', 'ASC'],
                        ['seatNumber', 'ASC'],
                    ],
                });

                const sessions = await Session.findAll({
                    where: { hallId: hall.id },
                    order: [['sessionTime', 'ASC']],
                });

                const sessionsWithFormattedTime = sessions.map(session => ({
                    ...session.toJSON(),
                    sessionTime: removeTimeZone(session.sessionTime),
                }));

                const hallDto = new HallDto(hall, seats, sessionsWithFormattedTime);
                res.json(hallDto);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getHallById(req, res) {
        try {
            const { id } = req.params;
            const hall = await Hall.findByPk(id, { include: [Seat] });

            if (!hall) {
                return res.status(404).json({ error: 'Hall not found' });
            }

            const seats = await Seat.findAll({
                where: { hallId: id },
                include: [SeatPriceCategory],
                order: [
                    ['id', 'ASC'],
                    ['rowNumber', 'ASC'],
                    ['seatNumber', 'ASC'],
                ],
            });

            const sessions = await Session.findAll({
                where: { hallId: id },
                order: [['sessionTime', 'ASC']],
            });

            const sessionsWithFormattedTime = sessions.map(session => ({
                ...session.toJSON(),
                sessionTime: removeTimeZone(new Date(session.sessionTime)),
            }));

            const hallDto = new HallDto(hall, seats, sessionsWithFormattedTime);
            res.json(hallDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deleteHall(req, res) {
        try {
            const { id } = req.params;
            const hall = await Hall.findByPk(id, {
                include: {
                    model: Seat,
                    include: [SeatPriceCategory],
                },
            });

            if (!hall) {
                return res.status(404).json({ error: 'Hall not found' });
            }

            const seatPriceCategoryIds = new Set();
            hall.Seats.forEach(seat => {
                if (seat.SeatPriceCategory) {
                    seatPriceCategoryIds.add(seat.SeatPriceCategory.id);
                }
            });

            await hall.destroy({ force: true });

            await SeatPriceCategory.destroy({
                where: {
                    id: Array.from(seatPriceCategoryIds),
                },
            });

            res.json({ message: 'Hall and associated seat categories deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async createSessionWithSeats(req, res) {
        try {
            const { hallId, sessionTime } = req.body;

            // Форматируем время сессии, добавляя 3 часа
            const sessionTimeObj = new Date(sessionTime);
            const formattedSessionTime = new Date(sessionTimeObj.setHours(sessionTimeObj.getHours() + 3));

            // Проверяем, существует ли фильм, и создаем его, если не существует
            let movie = await Movie.findOne({ where: { title: 'Sample Movie' } });
            if (!movie) {
                movie = await Movie.create({
                    title: 'Sample Movie',
                    description: 'This is a sample movie description.',
                    director: 'Тест',
                    duration: 120, // Продолжительность в минутах
                    releaseDate: new Date('2023-01-01'), // Дата выхода
                    genres: ['Драма', 'Фантастика'],
                    ageRating: 8.5, // Рейтинг фильма
                    actors: ['Актер 1', 'Актер 2'],
                });
            }

            // Создаем новую сессию с отформатированным временем
            const newSession = await Session.create({
                movieId: movie.id,
                hallId,
                sessionTime: formattedSessionTime,
            });

            // Получаем все места для указанного зала, которые не привязаны к сессии
            const seatsWithoutSession = await Seat.findAll({
                where: {
                    hallId,
                    sessionId: null, // Только места без привязки к сессии
                },
            });

            // Обновляем места, добавляя sessionId
            await Promise.all(
                seatsWithoutSession.map(seat => Seat.update({ sessionId: newSession.id }, { where: { id: seat.id } }))
            );

            // Определяем общее количество мест в зале
            const totalSeatsInHall = await Seat.count({ where: { hallId } });

            // Рассчитываем количество дополнительных мест, которые нужно создать
            const additionalSeatsNeeded = totalSeatsInHall - seatsWithoutSession.length;

            if (additionalSeatsNeeded > 0) {
                const seats = await Seat.findAll({
                    where: { hallId },
                });

                const newSeats = seats.slice(0, additionalSeatsNeeded).map(seat => ({
                    hallId: seat.hallId,
                    seatPriceCategoryId: seat.seatPriceCategoryId,
                    rowNumber: seat.rowNumber,
                    seatNumber: seat.seatNumber,
                    isAvailable: seat.isAvailable,
                    sessionId: newSession.id, // Связываем с новой сессией
                }));

                // Сохраняем новые места в базе данных
                await Seat.bulkCreate(newSeats);
            }

            // Возвращаем созданную сессию в ответе
            res.json(newSession);
        } catch (error) {
            console.error('Ошибка при создании сессии с местами:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Создаем зал
    // К залу крепим места
    // К этому залу крепим сессии, условно две сессии
    // В момент создания сессии, должно создаваться доп. кол-во мест (Все уникальные айдишники мест * кол-во сессий, все в одном зале)
    // У каждого места - одинаковый зал, но разные айди сессий.
};
