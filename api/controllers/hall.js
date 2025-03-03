import Hall from '../models/hall.js';
import Seat from '../models/seat.js';
import HallDto from '../dtos/hall-dto.js';
import SeatPriceCategory from '../models/seat-price-category.js';

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
                        ['rowNumber', 'ASC'],
                        ['seatNumber', 'ASC'],
                    ],
                });

                const hallDto = new HallDto(hall, seats);
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
                    ['rowNumber', 'ASC'],
                    ['seatNumber', 'ASC'],
                ],
            });

            const hallDto = new HallDto(hall, seats);
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
};
