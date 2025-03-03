export default class HallDto {
    id;
    name;
    seats;

    constructor(hall, seats) {
        this.id = hall.id;
        this.name = hall.name;
        this.seats = seats.map(seat => ({
            id: seat.id,
            rowNumber: seat.rowNumber,
            seatNumber: seat.seatNumber,
            isAvailable: Boolean(seat.isAvailable),
            categoryName: seat.SeatPriceCategory.categoryName,
            price: seat.SeatPriceCategory.price,
        }));
    }
}
