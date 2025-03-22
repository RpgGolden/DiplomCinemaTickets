import Seat from '../models/seat.js';
import Session from '../models/session.js';
import Movie from '../models/movie.js';
import Hall from '../models/hall.js';
import User from '../models/user.js';
import { AppErrorInvalid, AppErrorNotExist } from '../utils/errors.js';
import UserPaymentMethod from '../models/user-payment-methods.js';
import Ticket from '../models/ticket.js';
import sendTicketConfirmationEmail from '../utils/mailer.js';
export default {
    async createTicket(req, res) {
        try {
            const { sessionId, seatId, userPaymentMethodId } = req.body;
            const user = req.user;

            // Проверяем, существует ли пользователь
            const userData = await User.findByPk(user.id);
            if (!userData) {
                throw new AppErrorNotExist('User not found');
            }

            // Проверяем, существует ли сессия
            const session = await Session.findByPk(sessionId);
            if (!session) {
                throw new AppErrorNotExist('Session not found');
            }

            // Проверяем, существует ли место
            const seat = await Seat.findOne({
                where: [{ id: seatId }, { sessionId: session.id }],
            });
            if (!seat || seat.isAvailable === false) {
                throw new AppErrorInvalid('Seat not found');
            }

            // Проверяем, существует ли метод оплаты
            const userPaymentMethod = await UserPaymentMethod.findOne({
                where: { id: userPaymentMethodId, userId: user.id },
            });
            if (!userPaymentMethod) {
                throw new AppErrorNotExist('Payment method not found');
            }

            // Создаем билет и связываем его с сессией и местом
            const ticket = await Ticket.create({
                sessionId: session.id,
                seatId: seat.id,
                userId: user.id,
                userPaymentMethodId: userPaymentMethod.id,
            });

            // Обновляем статус места на "занято"
            seat.isAvailable = false;
            await seat.save();

            // Отправляем подтверждение на почту
            await sendTicketConfirmationEmail(
                userData.email, // Email пользователя
                userData.name, // Имя пользователя
                ticket.id, // ID билета
                session.title, // Название сессии
                seat.number, // Номер места
                session.date // Дата мероприятия
            );

            return res.status(201).json({ message: 'Ticket created successfully', ticket });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    },
};
