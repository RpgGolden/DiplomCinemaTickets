import nodemailer from 'nodemailer';
import 'dotenv/config';
async function sendTicketConfirmationEmail(
    clientEmail,
    clientName,
    ticketId,
    sessionTitle,
    seatNumber,
    eventDate
) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.yandex.ru',
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER_SMTP,
                pass: process.env.PASS_SMTP,
            },
        });

        const mailOptions = {
            from: '"Kino Iskra" <r.orlov@keep-calm.ru>',
            to: clientEmail,
            subject: 'Подтверждение оформления билета',
            text: `Ваш билет успешно оформлен!\n\nПараметры билета:\n- Имя клиента: ${clientName}\n- Номер билета: ${ticketId}\n- Название сессии: ${sessionTitle}\n- Номер места: ${seatNumber}\n- Дата мероприятия: ${eventDate}\n\nСпасибо за покупку!`,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending ticket confirmation email:', error);
        throw new Error('Failed to send ticket confirmation email');
    }
}

export default sendTicketConfirmationEmail;
