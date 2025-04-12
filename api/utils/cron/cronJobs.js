import cron from 'node-cron';
import Ticket from '../../models/ticket.js';
import Session from '../../models/session.js';
import Movie from '../../models/movie.js';
import moment from 'moment-timezone';

// Функция для обновления статусов билетов
export default async function updateTicketStatuses() {
    try {
        // Получаем все билеты со статусом 'purchased'
        const tickets = await Ticket.findAll({
            where: { ticketStatus: ['purchased', 'movie_started'] },
            include: [
                {
                    model: Session,
                    include: [
                        {
                            model: Movie,
                            attributes: ['duration'],
                        },
                    ],
                },
            ],
        });

        const currentTime = moment().utc().add(3, 'hours');

        for (const ticket of tickets) {
            const sessionStartTime = moment.tz(ticket.Session.sessionTime, 'YYYY-MM-DDTHH:mm:ssZ');
            const sessionEndTime = sessionStartTime.clone().add(ticket.Session.Movie.duration, 'minutes');
            if (currentTime.isAfter(sessionEndTime)) {
                await ticket.update({ ticketStatus: 'movie_ended' });
            } else if (currentTime.isAfter(sessionStartTime)) {
                await ticket.update({ ticketStatus: 'movie_started' });
            }
        }
    } catch (error) {
        console.error('Error updating ticket statuses:', error);
    }
}

// Запускаем крон-задачу каждую минуту
cron.schedule('* * * * *', () => {
    console.log('Обновление статусов билетов...');
    updateTicketStatuses().then(() => {
        console.log('Обновление статусов билетов завершено.');
    });
});
