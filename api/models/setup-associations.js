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
    User.hasOne(TokenSchema, { foreignKey: 'userId', onDelete: 'CASCADE' });
    TokenSchema.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

    // User model
    User.hasMany(Ticket, { foreignKey: 'userId', onDelete: 'CASCADE' });
    User.hasOne(UserBonus, { foreignKey: 'userId', onDelete: 'CASCADE' });
    User.hasMany(UserBonusHistory, { foreignKey: 'userId', onDelete: 'CASCADE' });
    User.hasMany(UserPaymentMethod, { foreignKey: 'userId', onDelete: 'CASCADE' });

    // Hall Model
    Hall.hasMany(Seat, { foreignKey: 'hallId', onDelete: 'CASCADE' });
    Hall.hasMany(Session, { foreignKey: 'hallId', onDelete: 'CASCADE' });

    // Session Model
    Session.belongsTo(Hall, { foreignKey: 'hallId', onDelete: 'CASCADE' });
    Session.hasMany(Ticket, { foreignKey: 'sessionId', onDelete: 'CASCADE' });

    // Seat model
    Seat.belongsTo(Hall, { foreignKey: 'hallId', onDelete: 'CASCADE' });
    Seat.hasMany(Ticket, { foreignKey: 'seatId', onDelete: 'CASCADE' });
    Seat.belongsTo(SeatPriceCategory, { foreignKey: 'seatPriceCategoryId', onDelete: 'CASCADE' });

    // Ticket model
    Ticket.belongsTo(Session, { foreignKey: 'sessionId', onDelete: 'CASCADE' });
    Ticket.belongsTo(Seat, { foreignKey: 'seatId', onDelete: 'CASCADE' });
    Ticket.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

    // Movie model
    Movie.hasMany(Session, { foreignKey: 'movieId', onDelete: 'CASCADE' });
    Session.belongsTo(Movie, { foreignKey: 'movieId', onDelete: 'CASCADE' });

    // Promotion model
    Promotion.belongsToMany(User, { through: 'UserPromotions', foreignKey: 'promotionId', onDelete: 'CASCADE' });
    User.belongsToMany(Promotion, { through: 'UserPromotions', foreignKey: 'userId', onDelete: 'CASCADE' });

    // UserBonus model
    UserBonus.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

    // UserBonusHistory Model
    UserBonusHistory.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

    // UserPaymentMethod Model
    UserPaymentMethod.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

    SeatPriceCategory.hasMany(Seat, { foreignKey: 'seatPriceCategoryId', onDelete: 'CASCADE' });
}
