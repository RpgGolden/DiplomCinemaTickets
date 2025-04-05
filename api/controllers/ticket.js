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
            const { sessionId, seatId, userPaymentMethodId } = req.body;
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

            // Проверяем, существует ли место
            const seat = await Seat.findOne({
                where: { id: seatId, sessionId: session.id },
                include: [{ model: SeatPriceCategory, attributes: ['price'] }],
            });
            if (!seat || seat.isAvailable === false) {
                throw new AppErrorInvalid('Seat not found');
            }

            // Проверяем, существует ли метод оплаты
            const userPaymentMethod = await UserPaymentMethod.findOne({
                where: { id: userPaymentMethodId, userId },
            });
            if (!userPaymentMethod) {
                throw new AppErrorNotExist('Payment method not found');
            }

            const seatPrice = seat.SeatPriceCategory.price;

            // Создаем билет и связываем его с сессией и местом
            const ticket = await Ticket.create({
                sessionId: session.id,
                seatId: seat.id,
                userId,
                paymentMethod: userPaymentMethod.methodType,
            });

            // Обновляем статус места на "занято"
            seat.isAvailable = false;
            await seat.save();

            // Начисляем 5% от стоимости билета в бонусы
            const earnedBonusPoints = Math.floor(seatPrice * 0.1);

            // Создаем запись в UserBonusHistory
            await UserBonusHistory.create({
                userId,
                ticketId: ticket.id,
                amount: seatPrice,
                description: 'Билет успешно забронирован',
            });

            // Начисляем бонусы пользователю
            await UserBonus.update(
                { bonusPoints: userData.UserBonu.bonusPoints + earnedBonusPoints },
                { where: { userId } }
            );

            const formattedSessionTime = moment(session.sessionTime).tz('UTC').format('DD-MM-YYYY HH:mm');

            // Отправляем подтверждение на почту
            await sendTicketConfirmationEmail(
                userData.email, // Email пользователя
                userData.name, // Имя пользователя
                ticket.id, // ID билета
                session.Movie.title, // Название фильма
                seat.seatNumber, // Номер места
                seat.rowNumber, // Номер ряда
                formattedSessionTime, // Дата мероприятия
                seatPrice, // Цена места
                ticket.paymentMethod // Способ оплаты
            );

            return res.status(201).json({ message: 'Билет(ы) успешно забронирован(ы), проверьте вашу почту', ticket });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    },
};
