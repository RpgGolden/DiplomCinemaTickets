import Seat from '../models/seat.js';
import Session from '../models/session.js';
import Movie from '../models/movie.js';
import { AppErrorNotExist } from '../utils/errors.js';
import Hall from '../models/hall.js';
import SessionDto from '../dtos/session-dto.js';
import SeatPriceCategory from '../models/seat-price-category.js';
import moment from 'moment-timezone';

export default {
    async createSessionWithSeats(req, res) {
        try {
            const { hallId, sessionTime, movieId, repeatDaily } = req.body;
            const hall = await Hall.findByPk(hallId, {
                include: [
                    {
                        model: Seat,
                    },
                ],
            });
            if (!hall) {
                throw new AppErrorNotExist('Hall not found');
            }

            const seatWithCategory = hall.Seats.find(seat => seat.seatPriceCategoryId !== null);
            const defaultSeatPriceCategoryId = seatWithCategory?.seatPriceCategoryId || null;

            // Форматируем время сессии, добавляя 3 часа
            const sessionTimeObj = new Date(sessionTime);
            const formattedSessionTime = new Date(sessionTimeObj.setHours(sessionTimeObj.getHours() + 3));

            // Проверяем, существует ли фильм
            const movie = await Movie.findOne({ where: { id: movieId } });
            if (!movie) {
                throw new AppErrorNotExist('Movie not found');
            }

            // Создаем оригинальную сессию
            const newSession = await Session.create({
                movieId: movie.id,
                hallId,
                sessionTime: formattedSessionTime,
                repeatDaily,
            });

            // Определяем общее количество мест в зале из модели Hall
            const totalSeatsInHall = hall.rowCount * hall.seatCount;

            // Получаем все места для указанного зала, которые не привязаны к сессии
            const seatsWithoutSession = await Seat.findAll({
                where: {
                    hallId,
                    sessionId: null,
                },
            });
            // Обновляем места, добавляя sessionId для оригинальной сессии
            await Promise.all(
                seatsWithoutSession.map(seat => Seat.update({ sessionId: newSession.id }, { where: { id: seat.id } }))
            );

            // Рассчитываем количество дополнительных мест, которые нужно создать
            const additionalSeatsNeeded = totalSeatsInHall - seatsWithoutSession.length;

            if (additionalSeatsNeeded > 0) {
                const newSeats = [];
                for (let row = 1; row <= hall.rowCount; row++) {
                    for (let seatNumber = 1; seatNumber <= hall.seatCount; seatNumber++) {
                        if (newSeats.length < additionalSeatsNeeded) {
                            newSeats.push({
                                hallId: hall.id,
                                seatPriceCategoryId: defaultSeatPriceCategoryId, // Укажите нужное значение
                                rowNumber: row,
                                seatNumber,
                                isAvailable: true, // Укажите нужное значение
                                sessionId: newSession.id,
                            });
                        }
                    }
                }

                // Сохраняем новые места в базе данных
                await Seat.bulkCreate(newSeats);
            }

            // Массив для хранения всех сессий
            const allSessions = [newSession];

            // Если repeatDaily равно true, создаем дополнительные сессии на следующие 6 дней
            if (repeatDaily) {
                const additionalSessions = [];
                for (let i = 1; i <= 6; i++) {
                    const nextSessionTime = new Date(formattedSessionTime);
                    nextSessionTime.setDate(nextSessionTime.getDate() + i);

                    additionalSessions.push({
                        movieId: movie.id,
                        hallId,
                        sessionTime: nextSessionTime,
                        originalSessionId: newSession.id, // Связываем с оригинальной сессией
                        repeatDaily: true,
                    });
                }

                // Создаем дополнительные сессии с помощью bulkCreate
                const createdAdditionalSessions = await Session.bulkCreate(additionalSessions);

                // Создаем места для каждой дополнительной сессии
                for (const additionalSession of createdAdditionalSessions) {
                    const newSeatsForAdditionalSession = [];
                    for (let row = 1; row <= hall.rowCount; row++) {
                        for (let seatNumber = 1; seatNumber <= hall.seatCount; seatNumber++) {
                            newSeatsForAdditionalSession.push({
                                hallId: hall.id,
                                seatPriceCategoryId: defaultSeatPriceCategoryId, // Укажите нужное значение
                                rowNumber: row,
                                seatNumber,
                                isAvailable: true, // Укажите нужное значение
                                sessionId: additionalSession.id, // Связываем с дополнительной сессией
                            });
                        }
                    }

                    // Сохраняем новые места для дополнительной сессии в базе данных
                    await Seat.bulkCreate(newSeatsForAdditionalSession);
                }

                // Добавляем все дополнительные сессии в массив
                allSessions.push(...createdAdditionalSessions);
            }

            // Возвращаем все созданные сессии в ответе
            res.json(allSessions);
        } catch (error) {
            console.error('Ошибка при создании сессии с местами:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async deleteSession(req, res) {
        try {
            const { id } = req.params;

            // Находим оригинальную сессию
            const session = await Session.findByPk(id);
            if (!session) {
                throw new AppErrorNotExist('Session not found');
            }

            // Удаляем оригинальную сессию
            await session.destroy();

            res.json({ message: 'Сессия успешно удалена' });
        } catch (error) {
            console.error('Ошибка при удалении сессии:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deleteManySessions(req, res) {
        try {
            const sessionIds = req.body.ids;
            if (!Array.isArray(sessionIds) || sessionIds.length === 0) {
                return res.status(400).json({ error: 'No session IDs provided' });
            }
            await Session.destroy({ where: { id: sessionIds } }, { force: true });
            res.json({ message: 'Сессии успешно удалены' });
        } catch (error) {
            console.error('Ошибка при удалении сессий:', error);
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
                    },
                    {
                        model: Seat,
                        attributes: ['id', 'rowNumber', 'seatNumber', 'isAvailable'],
                        include: [
                            {
                                model: SeatPriceCategory,
                                attributes: ['id', 'categoryName', 'price'],
                            },
                        ],
                    },
                ],
            });
            const sessionDto = new SessionDto(session);
            const sessionWithoutTZ = {
                ...sessionDto,
                sessionTime: moment(sessionDto.sessionTime).tz('UTC').format('DD-MM-YYYY HH:mm'),
            };

            if (sessionWithoutTZ.seats) {
                sessionWithoutTZ.seats.sort((a, b) => {
                    if (a.rowNumber === b.rowNumber) {
                        return a.seatNumber - b.seatNumber;
                    }
                    return a.rowNumber - b.rowNumber;
                });
            }

            res.json(sessionWithoutTZ);
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
                    },
                    {
                        model: Seat,
                        attributes: ['id', 'rowNumber', 'seatNumber', 'isAvailable'],
                        include: [
                            {
                                model: SeatPriceCategory,
                                attributes: ['id', 'categoryName', 'price'],
                            },
                        ],
                    },
                ],
                order: [['sessionTime', 'DESC']],
            });

            const sessionDtos = sessions.map(session => {
                const formattedSessionTime = moment(session.sessionTime).tz('UTC').format('DD-MM-YYYY HH:mm');

                const sortedSeats = session.Seats
                    ? session.Seats.sort((a, b) => {
                          if (a.rowNumber === b.rowNumber) {
                              return a.seatNumber - b.seatNumber;
                          }
                          return a.rowNumber - b.rowNumber;
                      })
                    : [];

                return new SessionDto({
                    ...session.toJSON(),
                    sessionTime: formattedSessionTime,
                    Seats: sortedSeats,
                });
            });

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

    async deleteSeatPriceCategory(req, res) {
        try {
            const { id } = req.params;

            // Находим категорию (правильный синтаксис для findByPk)
            const seatPriceCategory = await SeatPriceCategory.findByPk(id);
            if (!seatPriceCategory) {
                throw new AppErrorNotExist('Категория не найдена');
            }

            // Обнуляем привязку в местах и получаем ID затронутых сессий
            const seats = await Seat.findAll({ where: { seatPriceCategoryId: id } });
            const sessionIds = [...new Set(seats.map(seat => seat.sessionId))];

            // Обновляем записи (сначала места, потом сессии)
            await Seat.update({ seatPriceCategoryId: null }, { where: { seatPriceCategoryId: id } });

            if (sessionIds.length > 0) {
                await Session.update({ isActive: false }, { where: { id: sessionIds } });
            }

            // Удаляем категорию (правильный синтаксис для destroy)
            await seatPriceCategory.destroy();

            res.json({ message: 'Категория удалена, сессии отключены' });
        } catch (error) {
            console.error('Ошибка:', error);
            res.status(500).json({
                error: error.message || 'Ошибка сервера',
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            });
        }
    },

    async updateDataSeatCategory(req, res) {
        try {
            const { id } = req.params; // ID категории цен мест
            const { categoryName, price } = req.body; // Новые данные

            // Находим категорию
            const seatPriceCategory = await SeatPriceCategory.findByPk(id);
            if (!seatPriceCategory) {
                throw new AppErrorNotExist('Seat price category not found');
            }

            // Обновляем данные
            await seatPriceCategory.update({
                categoryName,
                price,
            });

            res.json(seatPriceCategory); // Возвращаем обновленную категорию
        } catch (error) {
            console.error('Ошибка при обновлении категории цен мест:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async createSessionSeatCategory(req, res) {
        try {
            const { categoryName, price } = req.body;
            const existingCategory = await SeatPriceCategory.findOne({ where: { categoryName } });
            if (existingCategory) {
                return res.status(400).json({ error: 'Category name already exists' });
            }
            // Создаем новую категорию мест
            const seatPriceCategory = await SeatPriceCategory.create({ categoryName, price });

            res.json(seatPriceCategory); // Возвращаем созданную категорию мест в ответе
        } catch (error) {
            console.error('Ошибка при создании категории мест:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getSeatCategories(req, res) {
        try {
            const seatPriceCategories = await SeatPriceCategory.findAll({
                order: [['id', 'ASC']],
                attributes: ['id', 'categoryName', 'price'],
            });
            res.json(seatPriceCategories);
        } catch (error) {
            console.error('Ошибка при получении категорий мест:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getSeatCategory(req, res) {
        try {
            const { id } = req.params;
            const seatPriceCategory = await SeatPriceCategory.findByPk(id);
            if (!seatPriceCategory) {
                throw new AppErrorNotExist('Ошибка при получении категорий мест');
            }
            res.json(seatPriceCategory);
        } catch (error) {
            console.error('Ошибка при получении категорий мест:', error);
            res.status(404).json({ error: 'Not Found' });
        }
    },
};
