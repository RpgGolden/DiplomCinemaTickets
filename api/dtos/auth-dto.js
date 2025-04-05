import { map as rolesMap } from '../config/roles.js';

export default class AuthDto {
    id;
    name;
    surname;
    patronymic;
    email;
    role;

    constructor(model) {
        this.id = model.id;
        this.name = model.name;
        this.surname = model.surname;
        this.patronymic = model.patronymic;
        this.email = model.login;
        this.role = rolesMap[model.role];
    }
}
