export default class HallDto {
    id;
    name;
    rowCount;
    seatCount;
    seats;
    sessions; // Новое поле для хранения информации о сессиях

    constructor(hall, seats, sessions = []) {
        // Устанавливаем sessions в пустой массив по умолчанию
        this.id = hall.id;
        this.name = hall.name;
        this.rowCount = hall.rowCount;
        this.seatCount = hall.seatCount;
        this.seats = seats.map(seat => ({
            id: seat.id,
            rowNumber: seat.rowNumber,
            seatNumber: seat.seatNumber,
            isAvailable: Boolean(seat.isAvailable),
            categoryName: seat.SeatPriceCategory.categoryName,
            price: seat.SeatPriceCategory.price,
            sessionId: seat.sessionId,
        }));
        this.sessions = sessions.map(session => ({
            id: session.id,
            movieId: session.movieId,
            sessionTime: session.sessionTime,
        }));
    }
}
