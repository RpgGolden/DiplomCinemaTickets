import { map as rolesMap } from '../config/roles.js';
class UserDto {
    id;
    name;
    surname;
    patronymic;
    email;
    role;
    paymentMethods;

    constructor(user, paymentMethods = [] || null) {
        this.id = user.id;
        this.name = user.name;
        this.surname = user.surname;
        this.patronymic = user.patronymic;
        this.email = user.email;
        this.role = rolesMap[user.role];
        this.paymentMethods = paymentMethods || null;
    }
}

class ProfileAdminDto {
    id;
    name;
    surname;
    patronymic;
    email;

    constructor(user) {
        this.id = user.id;
        this.name = user.name;
        this.surname = user.surname;
        this.patronymic = user.patronymic;
        this.email = user.email;
    }
}
export { UserDto, ProfileAdminDto };
