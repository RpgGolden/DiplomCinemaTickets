class UserDto {
    id;
    name;
    surname;
    patronymic;
    paymentMethods;

    constructor(user, paymentMethods = [] || null) {
        this.id = user.id;
        this.name = user.name;
        this.surname = user.surname;
        this.patronymic = user.patronymic;
        this.paymentMethods = paymentMethods || null;
    }
}

class ProfileAdminDto {
    id;
    name;
    surname;
    patronymic;

    constructor(user) {
        this.id = user.id;
        this.name = user.name;
        this.surname = user.surname;
        this.patronymic = user.patronymic;
    }
}
export { UserDto, ProfileAdminDto };
