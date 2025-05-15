import nodemailer from 'nodemailer';
import QRcode from 'qrcode';

/**
 * Отправляет email с подтверждением бронирования билета и QR-кодом
 * @param {string} clientEmail - Email клиента
 * @param {string} clientName - Имя клиента
 * @param {string} ticketId - ID билета
 * @param {string} sessionTitle - Название фильма/сеанса
 * @param {string} seatNumber - Номер места
 * @param {string} seatRownumber - Номер ряда
 * @param {string} eventDate - Дата мероприятия
 * @param {number} seatPrice - Цена билета
 * @param {string} paymentMethod - Способ оплаты ('cash', 'bonus', 'cards')
 * @returns {Promise<void>}
 */
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
        // 1. Создаем транспорт для отправки email
        const transporter = nodemailer.createTransport({
            host: 'smtp.yandex.ru',
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER_SMTP,
                pass: process.env.PASS_SMTP,
            },
        });

        // 2. Генерируем QR-код с данными билета
        const qrCodeData = JSON.stringify({
            ticketId,
            sessionTitle,
            seat: `${seatRownumber}-${seatNumber}`,
            date: eventDate,
        });

        const qrCodeImage = await QRcode.toDataURL(qrCodeData);

        // 3. Форматируем способ оплаты
        const paymentMethodText = {
            cash: 'наличными',
            bonus: 'бонусами',
            cards: 'картой',
        }[paymentMethod] || 'неизвестно';

        // 4. Рассчитываем бонусы (10% от стоимости)
        const earnedBonusPoints = Math.floor(seatPrice * 0.1);

        // 5. Формируем письмо
        const mailOptions = {
            from: '"Kino Iskra" <r.orlov@keep-calm.ru>',
            to: clientEmail,
            subject: 'Подтверждение оформления билета',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2c3e50;">Ваш билет успешно оформлен!</h2>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                        <h3 style="margin-top: 0;">Детали билета:</h3>
                        <ul style="list-style-type: none; padding: 0;">
                            <li><strong>Имя:</strong> ${clientName}</li>
                            <li><strong>Номер билета:</strong> ${ticketId}</li>
                            <li><strong>Фильм:</strong> ${sessionTitle}</li>
                            <li><strong>Место:</strong> Ряд ${seatRownumber}, Место ${seatNumber}</li>
                            <li><strong>Дата:</strong> ${eventDate}</li>
                            <li><strong>Способ оплаты:</strong> ${paymentMethodText}</li>
                            <li><strong>Начислено бонусов:</strong> ${earnedBonusPoints} баллов</li>
                            <li><strong>Стоимость:</strong> ${seatPrice} руб.</li>
                        </ul>
                    </div>

                    <div style="margin: 25px 0; text-align: center;">
                        <h3>QR-код для входа</h3>
                        <img src="${qrCodeImage}" alt="QR-код билета" style="width: 200px; height: 200px;"/>
                        <p style="font-size: 12px; color: #7f8c8d;">Покажите этот код на входе</p>
                    </div>

                    <p style="color: #7f8c8d; font-size: 14px;">
                        Спасибо за покупку!<br>
                        С уважением, команда Kino Iskra
                    </p>
                </div>
            `,
            text: `Ваш билет успешно оформлен!\n\nДетали:\n- Фильм: ${sessionTitle}\n- Место: Ряд ${seatRownumber}, Место ${seatNumber}\n- Дата: ${eventDate}\n- Стоимость: ${seatPrice} руб.\n\nQR-код прикреплен к письму.\n\nСпасибо за покупку!`,
        };

        // 6. Отправляем письмо
        await transporter.sendMail(mailOptions);
        console.log(`Письмо с билетом отправлено на ${clientEmail}`);
    } catch (error) {
        console.error('Ошибка при отправке письма:', error);
        throw new Error('Не удалось отправить подтверждение билета');
    }
}

export default sendTicketConfirmationEmail;
