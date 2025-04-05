export default class UserDto {
    id;
    name;
    surname;
    patronymic;
    paymentMethods;

    constructor(user, paymentMethods = []) {
        this.id = user.id;
        this.name = user.name;
        this.surname = user.surname;
        this.patronymic = user.patronymic;
        this.paymentMethods = paymentMethods;
    }
}
