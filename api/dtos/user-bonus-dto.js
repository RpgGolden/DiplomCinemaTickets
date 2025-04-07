import moment from "moment-timezone";

class UserBonusDto {
    id;
    name;
    surname;
    patronymic;
    bonusPoints;

    constructor(userBonus) {
        this.id = userBonus.userId;
        this.name = userBonus.User.name;
        this.surname = userBonus.User.surname;
        this.patronymic = userBonus.User.patronymic;
        this.bonusPoints = userBonus.bonusPoints;
    }
}
export default class UserBonusHistoryDto {
    id;
    userId;
    amount;
    ticketId;
    ticketPrice;
    description;
    createdAt;
    seatNumber;
    rowNumber;
    movieTitle;
    sessionTime;

    constructor(userBonusHistory, seatNumber, rowNumber, movieTitle, sessionTime) {
        this.id = userBonusHistory.id;
        this.userId = userBonusHistory.userId;
        this.amount = userBonusHistory.amount;
        this.ticketId = userBonusHistory.ticketId;
        this.ticketPrice = userBonusHistory.ticketPrice;
        this.description = userBonusHistory.description;
        this.createdAt = userBonusHistory.createdAt;
        this.seatNumber = seatNumber;
        this.rowNumber = rowNumber;
        this.movieTitle = movieTitle;
        this.sessionTime = moment(sessionTime).tz('UTC').format('YYYY-MM-DDTHH:mm');
    }
}

export { UserBonusDto, UserBonusHistoryDto };
