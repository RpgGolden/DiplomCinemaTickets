import Seat from '../models/seat.js';
import Session from '../models/session.js';
import Movie from '../models/movie.js';
import { AppErrorNotExist } from '../utils/errors.js';
import Hall from '../models/hall.js';
import SessionDto from '../dtos/session-dto.js';
import SeatPriceCategory from '../models/seat-price-category.js';

export default {
    async createSessionWithSeats(req, res) {
        try {
            const { hallId, sessionTime, movieId } = req.body;
            const hall = await Hall.findByPk(hallId);
            if (!hall) {
                throw new AppErrorNotExist('Hall not found');
            }
            // Форматируем время сессии, добавляя 3 часа
            const sessionTimeObj = new Date(sessionTime);
            const formattedSessionTime = new Date(sessionTimeObj.setHours(sessionTimeObj.getHours() + 3));

            // Проверяем, существует ли фильм, и создаем его, если не существует
            const movie = await Movie.findOne({ where: { id: movieId } });
            if (!movie) {
                throw new AppErrorNotExist('Movie not found');
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
    async getSession(req, res) {
        try {
            const { id } = req.params;
            const session = await Session.findByPk(id, {
                include: [
                    {
                        model: Hall,
                        attributes: ['id', 'name'],
                    },
                    {
                        model: Movie,
                        attributes: ['id', 'title'],
                    },
                    {
                        model: Seat,
                        attributes: ['id', 'rowNumber', 'seatNumber', 'isAvailable'],
                        include: [
                            {
                                model: SeatPriceCategory,
                                attributes: ['id', 'categoryName', 'price'], // Include category name and price
                            },
                        ],
                    },
                ],
            });
            if (!session) {
                throw new AppErrorNotExist('Session not found');
            }
            const sessionDto = new SessionDto(session);
            res.json(sessionDto);
        } catch (error) {
            console.error('Ошибка при получении сессии:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getAllSessions(req, res) {
        try {
            const sessions = await Session.findAll({
                include: [
                    {
                        model: Hall,
                        attributes: ['id', 'name'],
                    },
                    {
                        model: Movie,
                        attributes: ['id', 'title'],
                    },
                    {
                        model: Seat,
                        attributes: ['id', 'rowNumber', 'seatNumber', 'isAvailable'],
                        include: [
                            {
                                model: SeatPriceCategory,
                                attributes: ['id', 'categoryName', 'price'], // Include category name and price
                            },
                        ],
                    },
                ],
            });
            const sessionDtos = sessions.map(session => new SessionDto(session));
            res.json(sessionDtos);
        } catch (error) {
            console.error('Ошибка при получении всех сессий:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async changeStatusSession(req, res) {
        try {
            const { id } = req.params;
            const session = await Session.findByPk(id);
            if (!session) {
                throw new AppErrorNotExist('Session not found');
            }
            await session.update({ isActive: !session.isActive });
            res.json(session);
        } catch (error) {
            console.error('Ошибка при деактивации сессии:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async updateSessionSeatCategory(req, res) {
        try {
            const { id } = req.params; // Получаем ID сессии из параметров
            const { seatPriceCategoryId } = req.body; // Получаем новую категорию мест из тела запроса

            const session = await Session.findByPk(id);
            if (!session) {
                throw new AppErrorNotExist('Session not found');
            }
            const seatPriceCategory = await SeatPriceCategory.findByPk(seatPriceCategoryId);
            if (!seatPriceCategory) {
                throw new AppErrorNotExist('Seat price category not found');
            }
            // Обновляем места, устанавливая новую категорию мест
            await Seat.update(
                { seatPriceCategoryId }, // Устанавливаем новую категорию мест
                { where: { sessionId: session.id } } // Обновляем места, связанные с этой сессией
            );

            res.json({ message: 'Seat category updated successfully' }); // Возвращаем успешное сообщение
        } catch (error) {
            console.error('Ошибка при обновлении категории мест сессии:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
