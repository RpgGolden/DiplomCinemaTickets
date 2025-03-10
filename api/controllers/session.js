import Seat from '../models/seat.js';
import Session from '../models/session.js';
import Movie from '../models/movie.js';
import { AppErrorNotExist } from '../utils/errors.js';
import Hall from '../models/hall.js';

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
};
