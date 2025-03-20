import Hall from '../models/hall.js';
import Seat from '../models/seat.js';
import HallDto from '../dtos/hall-dto.js';
import SeatPriceCategory from '../models/seat-price-category.js';
import Session from '../models/session.js';
import removeTimeZone from '../utils/removetimezone.js';

export default {
    async createHall(req, res) {
        const { hallName, rowNumber, seatNumber, categoryName, price } = req.body;

        try {
            const hall = await Hall.create({ name: hallName });

            // Проверка на существование категории
            let seatPriceCategory = await SeatPriceCategory.findOne({
                where: {
                    categoryName,
                    price,
                },
            });

            // Если нет категории, создаем новую
            if (!seatPriceCategory) {
                seatPriceCategory = await SeatPriceCategory.create({
                    categoryName,
                    price,
                });
            }

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

            if (halls.length === 0) {
                res.json([]);
            }

            const hallsDto = [];

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
                hallsDto.push(hallDto);
            }

            res.json(hallsDto);
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
                },
            });

            if (!hall) {
                return res.status(404).json({ error: 'Hall not found' });
            }

            // Удаляем все места, связанные с залом
            await Seat.destroy({ where: { hallId: hall.id } });

            // Удаляем зал
            await hall.destroy({ force: true });

            res.json({ message: 'Hall and associated seats deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Создаем зал
    // К залу крепим места
    // К этому залу крепим сессии, условно две сессии
    // В момент создания сессии, должно создаваться доп. кол-во мест (Все уникальные айдишники мест * кол-во сессий, все в одном зале)
    // У каждого места - одинаковый зал, но разные айди сессий.
};
