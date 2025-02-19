import { models } from './index.js';
const {
    User,
    TokenSchema,
    Movie,
    Promotion,
    Seat,
    Session,
    Ticket,
    UserBonus,
    Hall,
    SeatPriceCategory,
    UserBonusHistory,
    UserPaymentMethod,
} = models;

export default function () {
    User.hasOne(TokenSchema, { foreignKey: 'userId' });
    TokenSchema.belongsTo(User, { foreignKey: 'userId' });

    // User модель
    User.hasMany(Ticket, { foreignKey: 'userId' });
    User.hasOne(UserBonus, { foreignKey: 'userId' });
    User.hasMany(UserBonusHistory, { foreignKey: 'userId' });
    User.hasMany(UserPaymentMethod, { foreignKey: 'userId' });

    // Hall Model
    Hall.hasMany(Seat, { foreignKey: 'hallId' });
    Hall.hasMany(Session, { foreignKey: 'hallId' });

    // Session Model
    Session.belongsTo(Hall, { foreignKey: 'hallId' });
    Session.hasMany(Ticket, { foreignKey: 'sessionId' });

    // Seat model
    Seat.belongsTo(Hall, { foreignKey: 'hallId' });
    Seat.hasMany(Ticket, { foreignKey: 'seatId' });
    Seat.belongsTo(SeatPriceCategory, { foreignKey: 'priceCategoryId' });
    

    // Ticket model
    Ticket.belongsTo(Session, { foreignKey: 'sessionId' });
    Ticket.belongsTo(Seat, { foreignKey: 'seatId' });
    Ticket.belongsTo(User, { foreignKey: 'userId' });

    // Movie model
    Movie.hasMany(Session, { foreignKey: 'movieId' });
    Session.belongsTo(Movie, { foreignKey: 'movieId' });

    // Promotion model
    Promotion.belongsToMany(User, { through: 'UserPromotions', foreignKey: 'promotionId' });
    User.belongsToMany(Promotion, { through: 'UserPromotions', foreignKey: 'userId' });

    // UserBonus model
    UserBonus.belongsTo(User, { foreignKey: 'userId' });

    // UserBonusHistory Model
    UserBonusHistory.belongsTo(User, { foreignKey: 'userId' });

    // UserPaymentMethod Model
    UserPaymentMethod.belongsTo(User, { foreignKey: 'userId' });

    SeatPriceCategory.hasMany(Seat, { foreignKey: 'priceCategoryId' });
}
