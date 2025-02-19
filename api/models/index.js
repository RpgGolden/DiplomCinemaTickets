import { Sequelize } from 'sequelize';
import User from './user.js';
import TokenSchema from './token-model.js';

import 'dotenv/config';
import Movie from './movie.js';
import Promotion from './promotion.js';
import Seat from './seat.js';
import Session from './session.js';
import Ticket from './ticket.js';
import UserBonus from './user-bonus.js';
import Hall from './hall.js';

const { DB_USER, DB_PWD, DB_HOST, DB_PORT, DB_NAME } = process.env;

export const models = {
    User,
    TokenSchema,
    Movie,
    Hall,
    Promotion,
    Seat,
    Session,
    Ticket,
    UserBonus,
};
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PWD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
        // multipleStatements: true,
        typeCast: true,
    },
    define: {
        // charset: 'utf8mb4',
        // collate: 'utf8mb4_unicode_ci',
        timestamps: true,
        underscored: true,
    },
    logging: false,
});
