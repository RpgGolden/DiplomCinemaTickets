export default class SessionDto {
    id;
    sessionTime;
    isActive;
    repeatDaily;
    hall;
    movie;
    seats;

    constructor(session) {
        this.id = session.id;
        this.sessionTime = session.sessionTime;
        this.isActive = session.isActive;
        this.repeatDaily = session.repeatDaily;
        this.hall = session.Hall;
        this.movie = session.Movie;
        this.seats = session.Seats.map(seat => ({
            id: seat.id,
            rowNumber: seat.rowNumber,
            seatNumber: seat.seatNumber,
            isAvailable: seat.isAvailable,
            seatPriceCategory: seat.SeatPriceCategory
                ? {
                      id: seat.SeatPriceCategory.id,
                      categoryName: seat.SeatPriceCategory.categoryName,
                      price: seat.SeatPriceCategory.price,
                  }
                : null,
        }));
    }
}
