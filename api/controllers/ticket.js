import Seat from '../models/seat.js';
import Session from '../models/session.js';
import User from '../models/user.js';
import { AppErrorInvalid, AppErrorNotExist } from '../utils/errors.js';
import UserPaymentMethod from '../models/user-payment-methods.js';
import Ticket from '../models/ticket.js';
import sendTicketConfirmationEmail from '../utils/mailer.js';
import UserBonusHistory from '../models/user-bonus-history.js';
import SeatPriceCategory from '../models/seat-price-category.js';
import Movie from '../models/movie.js';
import UserBonus from '../models/user-bonus.js';
import moment from 'moment-timezone';

export default {
    async createTicket(req, res) {
        try {
            const { sessionId, seatIds, userPaymentMethodId } = req.body;
            const userId = req.user.id;

            // Проверяем, существует ли пользователь
            const userData = await User.findByPk(userId, { include: [{ model: UserBonus }] });
            if (!userData) {
                throw new AppErrorNotExist('User not found');
            }

            // Проверяем, существует ли сессия
            const session = await Session.findByPk(sessionId, { include: [Movie] });
            if (!session) {
                throw new AppErrorNotExist('Session not found');
            }

            // Получаем места по массиву seatIds
            const seats = await Seat.findAll({
                where: { id: seatIds, sessionId: session.id },
                include: [{ model: SeatPriceCategory, attributes: ['price'] }],
            });

            // Проверяем доступность мест
            const availableSeats = seats.filter(seat => seat && seat.isAvailable);
            if (availableSeats.length !== seatIds.length) {
                throw new AppErrorInvalid('One or more seats are not available');
            }

            // Проверяем, существует ли метод оплаты
            const userPaymentMethod = await UserPaymentMethod.findOne({
                where: { id: userPaymentMethodId, userId },
            });
            if (!userPaymentMethod) {
                throw new AppErrorNotExist('Payment method not found');
            }

            const totalTicketPrice = availableSeats.reduce((total, seat) => total + seat.SeatPriceCategory.price, 0);

            // Проверяем способ оплаты
            if (userPaymentMethod.methodType === 'bonus') {
                // Проверяем, достаточно ли бонусов
                if (userData.UserBonu.bonusPoints < totalTicketPrice) {
                    throw new AppErrorInvalid('Not enough bonus points to complete the purchase');
                }
            }

            const totalEarnedBonusPoints = Math.round(totalTicketPrice * 0.1); // Округляем бонусы до целого
            const ticketPromises = availableSeats.map(async seat => {
                const seatPrice = seat.SeatPriceCategory.price;

                // Создаем билет и связываем его с сессией и местом
                const ticket = await Ticket.create({
                    sessionId: session.id,
                    seatId: seat.id,
                    userId,
                    paymentMethod: userPaymentMethod.methodType,
                });

                // Обновляем статус места на "занято"
                seat.isAvailable = false; // Должно быть false, а не true
                await seat.save();

                // Создаем запись в UserBonusHistory
                await UserBonusHistory.create({
                    userId,
                    ticketId: ticket.id,
                    amount: Math.round(totalEarnedBonusPoints / 2), // Округляем бонусы до целого
                    ticketPrice: seat.SeatPriceCategory.price,
                    description: 'Билет успешно забронирован',
                });

                return { ticket, seatPrice };
            });

            const ticketsInfo = await Promise.all(ticketPromises);

            // Начисляем бонусы пользователю

            // Если способ оплаты - бонус, списываем бонусы
            if (userPaymentMethod.methodType === 'bonus') {
                await UserBonus.update(
                    { bonusPoints: userData.UserBonu.bonusPoints - totalTicketPrice },
                    { where: { userId } }
                );
            } else {
                // Если не бонус, просто начисляем бонусы
                await UserBonus.update(
                    { bonusPoints: userData.UserBonu.bonusPoints + totalEarnedBonusPoints },
                    { where: { userId } }
                );
            }

            const formattedSessionTime = moment(session.sessionTime).tz('UTC').format('DD-MM-YYYY HH:mm');

            // Отправляем подтверждение на почту для каждого билета
            await Promise.all(
                ticketsInfo.map((info, index) => {
                    const seat = availableSeats[index]; // Получаем соответствующее место
                    return sendTicketConfirmationEmail(
                        userData.email, // Email пользователя
                        userData.name, // Имя пользователя
                        info.ticket.id, // ID билета
                        session.Movie.title, // Название фильма
                        seat.seatNumber, // Номер места
                        seat.rowNumber, // Номер ряда
                        formattedSessionTime, // Дата мероприятия
                        info.seatPrice, // Цена места
                        info.ticket.paymentMethod // Способ оплаты
                    );
                })
            );

            return res
                .status(201)
                .json({ message: 'Билет(ы) успешно забронирован(ы), проверьте вашу почту', tickets: ticketsInfo });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    },

    async cancelTicket(req, res) {
        try {
            const ticketId = req.params.id;

            const ticket = await Ticket.findByPk(ticketId, {
                include: [{ model: Seat, include: [SeatPriceCategory] }, { model: User }],
            });
            if (!ticket) {
                return res.status(404).json({ error: 'Ticket not found' });
            }
            if (
                ticket.ticketStatus === 'canceled' ||
                ticket.ticketStatus === 'movie_started' ||
                ticket.ticketStatus === 'movie_ended'
            ) {
                return res.status(400).json({ error: 'Вы уже не можете вернуть билет на этот сеанс.' });
            }

            const seat = ticket.Seat;
            seat.isAvailable = true;
            await seat.save();

            const user = ticket.User;
            const userBonus = await UserBonus.findOne({ where: { userId: user.id } });

            const ticketPrice = seat.SeatPriceCategory.price;

            if (ticket.paymentMethod === 'bonus') {
                if (userBonus) {
                    userBonus.bonusPoints += Math.floor(ticketPrice);
                    await userBonus.save();

                    // Записываем в историю бонусов
                    await UserBonusHistory.create({
                        userId: user.id,
                        amount: Math.floor(ticketPrice), // Начисленные бонусы
                        ticketPrice,
                        ticketId: ticket.id,
                        description: 'Бонусы начислены за отмену билета',
                    });
                }
            } else {
                if (userBonus) {
                    const bonusDeduction = Math.floor(ticketPrice * 0.1);
                    userBonus.bonusPoints = Math.max(0, userBonus.bonusPoints - bonusDeduction);
                    await userBonus.save();

                    // Записываем в историю бонусов
                    await UserBonusHistory.create({
                        userId: user.id,
                        amount: -bonusDeduction, // Списанные бонусы
                        ticketPrice,
                        ticketId: ticket.id,
                        description: 'Бонусы списаны за отмену билета',
                    });
                }
            }

            await Ticket.update({ isCancelled: true, ticketStatus: 'cancelled' }, { where: { id: ticketId } });

            return res.status(200).json({ message: 'Билет успешно отменен и бонусы начислены/списаны.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async getAllTickets(req, res) {
        try {
            const tickets = await Ticket.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['email', 'name'],
                    },
                    {
                        model: Session,
                        include: [
                            {
                                model: Movie,
                                attributes: ['title'],
                            },
                        ],
                    },
                    {
                        model: Seat,
                        include: [
                            {
                                model: SeatPriceCategory,
                                attributes: ['price'],
                            },
                        ],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            // Формируем массив с информацией о билетах
            const ticketsInfo = tickets.map(ticket => ({
                userId: ticket.userId,
                email: ticket.User.email,
                name: ticket.User.name,
                ticketId: ticket.id,
                movieTitle: ticket.Session.Movie.title,
                sessionId: ticket.Session.id,
                seatNumber: ticket.Seat.seatNumber,
                rowNumber: ticket.Seat.rowNumber,
                sessionTime: moment(ticket.Session.sessionTime).tz('UTC').format('DD-MM-YYYY HH:mm'),
                seatPrice: ticket.Seat.SeatPriceCategory.price,
                paymentMethod: ticket.paymentMethod,
                isCancelled: ticket.isCancelled,
                ticketStatus: ticket.ticketStatus,
            }));

            return res.status(200).json(ticketsInfo); // Возвращаем информацию о билетах
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getTicket(req, res) {
        try {
            const ticket = await Ticket.findByPk(req.params.id, {
                include: [
                    {
                        model: User,
                        attributes: ['email', 'name'],
                    },
                    {
                        model: Session,
                        include: [
                            {
                                model: Movie,
                                attributes: ['title'],
                            },
                        ],
                    },
                    {
                        model: Seat,
                        include: [
                            {
                                model: SeatPriceCategory,
                                attributes: ['price'],
                            },
                        ],
                    },
                ],
            });

            if (!ticket) {
                return res.status(404).json({ error: 'Ticket not found' });
            }

            // Формируем объект с информацией о билете
            const ticketInfo = {
                userId: ticket.userId,
                email: ticket.User.email,
                name: ticket.User.name,
                ticketId: ticket.id,
                movieTitle: ticket.Session.Movie.title,
                sessionId: ticket.Session.id,
                seatNumber: ticket.Seat.seatNumber,
                rowNumber: ticket.Seat.rowNumber,
                sessionTime: moment(ticket.Session.sessionTime).tz('UTC').format('DD-MM-YYYY HH:mm'),
                seatPrice: ticket.Seat.SeatPriceCategory.price,
                paymentMethod: ticket.paymentMethod,
                isCancelled: ticket.isCancelled,
                ticketStatus: ticket.ticketStatus,
            };

            return res.status(200).json(ticketInfo); // Возвращаем информацию о билете
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getAllTicketsUser(req, res) {
        try {
            const tickets = await Ticket.findAll({
                where: { userId: req.user.id },
                include: [
                    {
                        model: User,
                        attributes: ['email', 'name'],
                    },
                    {
                        model: Session,
                        include: [
                            {
                                model: Movie,
                                attributes: ['title'],
                            },
                        ],
                    },
                    {
                        model: Seat,
                        include: [
                            {
                                model: SeatPriceCategory,
                                attributes: ['price'],
                            },
                        ],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            // Формируем массив с информацией о билетах
            const ticketsInfo = tickets.map(ticket => ({
                userId: ticket.userId,
                email: ticket.User.email,
                name: ticket.User.name,
                ticketId: ticket.id,
                movieTitle: ticket.Session.Movie.title,
                sessionId: ticket.Session.id,
                seatNumber: ticket.Seat.seatNumber,
                rowNumber: ticket.Seat.rowNumber,
                sessionTime: moment(ticket.Session.sessionTime).tz('UTC').format('DD-MM-YYYY HH:mm'),
                seatPrice: ticket.Seat.SeatPriceCategory.price,
                paymentMethod: ticket.paymentMethod,
                isCancelled: ticket.isCancelled,
                ticketStatus: ticket.ticketStatus,
            }));

            return res.status(200).json(ticketsInfo); // Возвращаем информацию о билетах
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getBookedTickets(req, res) {
        try {
            // Extract filter parameters from the request query
            const { paymentMethod, isCancelled, ticketStatus, excludeFields } = req.query;

            // Build the where clause dynamically based on the provided filters
            const filters = {};

            if (paymentMethod) {
                filters.paymentMethod = paymentMethod;
            }

            if (isCancelled !== undefined && isCancelled !== null && isCancelled !== '') {
                filters.isCancelled = isCancelled === 'true';
            }

            if (ticketStatus) {
                filters.ticketStatus = ticketStatus;
            }

            // Fetch tickets with the constructed where clause
            const tickets = await Ticket.findAll({
                where: filters,
                include: [
                    {
                        model: User,
                        attributes: ['email', 'name'],
                    },
                    {
                        model: Session,
                        include: [
                            {
                                model: Movie,
                                attributes: ['title'],
                            },
                        ],
                    },
                    {
                        model: Seat,
                        include: [
                            {
                                model: SeatPriceCategory,
                                attributes: ['price'],
                            },
                        ],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            // Map the tickets to the desired format, excluding specified fields
            const ticketsInfo = tickets.map(ticket => {
                const ticketData = {
                    userId: ticket.userId,
                    email: ticket.User.email,
                    name: ticket.User.name,
                    ticketId: ticket.id,
                    movieTitle: ticket.Session.Movie.title,
                    sessionId: ticket.Session.id,
                    seatNumber: ticket.Seat.seatNumber,
                    rowNumber: ticket.Seat.rowNumber,
                    sessionTime: moment(ticket.Session.sessionTime).tz('UTC').format('DD-MM-YYYY HH:mm'),
                    seatPrice: ticket.Seat.SeatPriceCategory.price,
                    paymentMethod: ticket.paymentMethod,
                    isCancelled: ticket.isCancelled,
                    ticketStatus: ticket.ticketStatus,
                };

                // Exclude fields if specified
                if (excludeFields) {
                    excludeFields.split(',').forEach(field => {
                        delete ticketData[field];
                    });
                }

                return ticketData;
            });

            return res.status(200).json(ticketsInfo);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
