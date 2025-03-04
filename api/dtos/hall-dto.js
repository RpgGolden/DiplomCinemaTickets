export default class HallDto {
    id;
    name;
    seats;
    sessions; // Новое поле для хранения информации о сессиях

    constructor(hall, seats, sessions) {
        this.id = hall.id;
        this.name = hall.name;
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
