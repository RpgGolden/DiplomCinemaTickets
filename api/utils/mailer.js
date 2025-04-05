import nodemailer from 'nodemailer';
import 'dotenv/config';

async function sendTicketConfirmationEmail(
    clientEmail,
    clientName,
    ticketId,
    sessionTitle,
    seatNumber,
    seatRownumber,
    eventDate,
    seatPrice,
    paymentMethod
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

        const paymentMethodText =
            paymentMethod === 'cash'
                ? 'наличными'
                : paymentMethod === 'bonus'
                  ? 'бонусами'
                  : paymentMethod === 'cards'
                    ? 'картой'
                    : 'неизвестно';

        const earnedBonusPoints = Math.floor(seatPrice * 0.1); // Начисляем 5% от стоимости билета

        const mailOptions = {
            from: '"Kino Iskra" <r.orlov@keep-calm.ru>',
            to: clientEmail,
            subject: 'Подтверждение оформления билета',
            text: `Ваш билет успешно оформлен!\n\nПараметры билета:\n- Имя клиента: ${clientName}\n- Номер билета: ${ticketId}\n- Название фильма: ${sessionTitle}\n- Номер ряда: ${seatRownumber}\n- Номер места: ${seatNumber}\n- Дата мероприятия: ${eventDate}\n- Способ оплаты: ${paymentMethodText}\n- Начисленные бонусы: ${earnedBonusPoints} баллов\n\nЦена билета: ${seatPrice} руб.\n\nСпасибо за покупку!`,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending ticket confirmation email:', error);
        throw new Error('Failed to send ticket confirmation email');
    }
}

export default sendTicketConfirmationEmail;
