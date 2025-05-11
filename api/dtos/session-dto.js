export default class SessionDto {
    id;
    sessionTime;
    isActive;
    repeatDaily;
    seatPriceCategoryId; // Новое поле
    categoryName; // Новое поле
    price; // Новое поле
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

        if (this.seats.length > 0 && this.seats[0].seatPriceCategory) {
            this.seatPriceCategoryId = this.seats[0].seatPriceCategory.id;
            this.categoryName = this.seats[0].seatPriceCategory.categoryName;
            this.price = this.seats[0].seatPriceCategory.price;
        } else {
            this.seatPriceCategoryId = null;
            this.categoryName = 'Не указано';
            this.price = 0;
        }
    }
}
