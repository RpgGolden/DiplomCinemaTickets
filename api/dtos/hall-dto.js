export default class HallDto {
    id;
    name;
    rowCount;
    seatCount;
    price;
    categoryName;
    seats;
    sessions; // New field for storing session information

    constructor(hall, seats, sessions = []) {
        // Set sessions to an empty array by default
        this.id = hall.id;
        this.name = hall.name;
        this.rowCount = hall.rowCount;
        this.seatCount = hall.seatCount;
        this.price = seats[0]?.SeatPriceCategory?.price;
        this.categoryName = seats[0]?.SeatPriceCategory?.categoryName;
        this.seats = seats.map(seat => ({
            id: seat.id,
            rowNumber: seat.rowNumber,
            seatNumber: seat.seatNumber,
            isAvailable: Boolean(seat.isAvailable),
            categoryName: seat.SeatPriceCategory ? seat.SeatPriceCategory.categoryName : null,
            price: seat.SeatPriceCategory ? seat.SeatPriceCategory.price : null,
            sessionId: seat.sessionId,
        }));
        this.sessions = sessions.map(session => ({
            id: session.id,
            movieId: session.movieId,
            sessionTime: session.sessionTime,
        }));
    }
}