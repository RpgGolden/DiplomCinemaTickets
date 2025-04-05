import UserBonus from '../models/user-bonus.js';
import UserBonusHistory from '../models/user-bonus-history.js';
import { UserBonusDto, UserBonusHistoryDto } from '../dtos/user-bonus-dto.js';
import Ticket from '../models/ticket.js';
import Session from '../models/session.js';
import Movie from '../models/movie.js';
import Seat from '../models/seat.js';
import User from '../models/user.js';
import { AppErrorMissing } from '../utils/errors.js';

export default {
    async getBonusHistory(req, res) {
        try {
            const userId = req.user.id;
            const history = await UserBonusHistory.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });

            // Получаем информацию о билетах для каждого элемента истории
            const historyDto = await Promise.all(
                history.map(async item => {
                    const ticket = await Ticket.findByPk(item.ticketId, {
                        include: [{ model: Session, include: [Movie] }],
                    });
                    const seat = ticket ? await Seat.findByPk(ticket.seatId) : null;

                    return new UserBonusHistoryDto(
                        item,
                        seat ? seat.seatNumber : null,
                        seat ? seat.rowNumber : null,
                        ticket ? ticket.Session.Movie.title : null,
                        ticket ? ticket.Session.sessionTime : null
                    );
                })
            );

            res.json(historyDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching bonus history.' });
        }
    },

    async getBonusHistoryById(req, res) {
        try {
            const { id } = req.params;
            const history = await UserBonusHistory.findByPk(id);

            if (!history) {
                throw new AppErrorMissing('History ID is required');
            }

            const ticket = await Ticket.findByPk(history.ticketId, {
                include: [{ model: Session, include: [Movie] }],
            });
            const seat = ticket ? await Seat.findByPk(ticket.seatId) : null;

            const historyDto = new UserBonusHistoryDto(
                history,
                seat ? seat.seatNumber : null,
                seat ? seat.rowNumber : null,
                ticket ? ticket.Session.Movie.title : null,
                ticket ? ticket.Session.sessionTime : null
            );

            res.json(historyDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching bonus history.' });
        }
    },

    async getAllBonusHistories(req, res) {
        try {
            const histories = await UserBonusHistory.findAll({
                order: [['createdAt', 'DESC']],
                include: [{ model: Ticket, include: [{ model: Session, include: [Movie] }] }], // Включаем информацию о билетах и фильмах
            });

            // Формируем DTO для каждой записи истории
            const historiesDto = await Promise.all(
                histories.map(async item => {
                    const ticket = await Ticket.findByPk(item.ticketId, {
                        include: [{ model: Session, include: [Movie] }],
                    });
                    const seat = ticket ? await Seat.findByPk(ticket.seatId) : null;

                    return new UserBonusHistoryDto(
                        item,
                        seat ? seat.seatNumber : null,
                        seat ? seat.rowNumber : null,
                        ticket ? ticket.Session.Movie.title : null,
                        ticket ? ticket.Session.sessionTime : null
                    );
                })
            );

            res.json(historiesDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching all bonus histories.' });
        }
    },

    async getUserBonus(req, res) {
        try {
            const userId = req.user.id;
            const userBonus = await UserBonus.findOne({
                where: { userId },
                include: [{ model: User, attributes: ['name', 'surname', 'patronymic'] }],
            });

            // Map the bonus to DTO
            const bonusDto = userBonus ? new UserBonusDto(userBonus) : null;
            res.json(bonusDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching user bonus.' });
        }
    },

    async getAllUserBonusesHistoryByUserId(req, res) {
        try {
            const userId = req.query.userId;
            if (!userId) {
                throw new AppErrorMissing('User ID is required');
            }
            // Fetch user bonuses along with their history
            const userBonuses = await UserBonus.findOne({ where: { userId } });
            const bonusHistory = await UserBonusHistory.findAll({
                where: { userId },
                order: [['createdAt', 'DESC']],
                include: [{ model: Ticket, include: [{ model: Session, include: [Movie] }] }], // Include ticket and movie details
            });

            // Map the bonus history to DTOs
            const historyDto = await Promise.all(
                bonusHistory.map(async item => {
                    const ticket = await Ticket.findByPk(item.ticketId, {
                        include: [{ model: Session, include: [Movie] }],
                    });
                    const seat = ticket ? await Seat.findByPk(ticket.seatId) : null;

                    return new UserBonusHistoryDto(
                        item,
                        seat ? seat.seatNumber : null,
                        seat ? seat.rowNumber : null,
                        ticket ? ticket.Session.Movie.title : null,
                        ticket ? ticket.Session.sessionTime : null
                    );
                })
            );

            // Prepare the response object
            const response = {
                userBonus: userBonuses,
                bonusHistory: historyDto,
            };

            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching user bonuses history.' });
        }
    },
};
