import { models } from './index.js';
const {
    User,
    TokenSchema,
    Movie,
    Seat,
    Session,
    Ticket,
    UserBonus,
    Hall,
    SeatPriceCategory,
    UserBonusHistory,
    UserPaymentMethod,
} = models;

// Промежуточная таблица.
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
    Hall.hasMany(Session, { foreignKey: 'hallId' }); // Убрали onDelete

    // Session Model
    Session.belongsTo(Hall, { foreignKey: 'hallId' }); // Убрали onDelete
    Session.hasMany(Ticket, { foreignKey: 'sessionId', onDelete: 'CASCADE' });

    // Seat model
    Seat.belongsTo(SeatPriceCategory, { foreignKey: 'seatPriceCategoryId' });
    Seat.belongsTo(Hall, { foreignKey: 'hallId', onDelete: 'CASCADE' });
    Seat.hasMany(Ticket, { foreignKey: 'seatId', onDelete: 'CASCADE' });

    // Сессии и места для уникальности залов
    Session.hasMany(Seat, { foreignKey: 'sessionId', onDelete: 'CASCADE' });
    Seat.belongsTo(Session, { foreignKey: 'sessionId', onDelete: 'CASCADE' });

    // Ticket model
    Ticket.belongsTo(Session, { foreignKey: 'sessionId', onDelete: 'CASCADE' });
    Ticket.belongsTo(Seat, { foreignKey: 'seatId', onDelete: 'CASCADE' });
    Ticket.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

    // Movie model
    Movie.hasMany(Session, { foreignKey: 'movieId' }); // Убрали onDelete
    Session.belongsTo(Movie, { foreignKey: 'movieId' }); // Убрали onDelete

    // // Promotion model
    // Promotion.belongsToMany(User, { through: 'UserPromotions', foreignKey: 'promotionId', onDelete: 'CASCADE' });
    // User.belongsToMany(Promotion, { through: 'UserPromotions', foreignKey: 'userId', onDelete: 'CASCADE' });

    // Promotion.belongsToMany(Movie, { through: 'MoviePromotions', foreignKey: 'promotionId' });
    // Movie.belongsToMany(Promotion, { through: 'MoviePromotions', foreignKey: 'movieId' });

    // Promotion.belongsToMany(Session, { through: 'PromotionSessions', foreignKey: 'promotionId' });
    // Session.belongsToMany(Promotion, { through: 'PromotionSessions', foreignKey: 'sessionId' });

    // Promotion.hasMany(Ticket, { foreignKey: 'promotionId' });
    // Ticket.belongsTo(Promotion, { foreignKey: 'promotionId' });

    // UserBonus model
    UserBonus.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

    // UserBonusHistory Model
    UserBonusHistory.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    UserBonusHistory.belongsTo(Ticket, { foreignKey: 'ticketId', onDelete: 'CASCADE' });

    // UserPaymentMethod Model
    UserPaymentMethod.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

    SeatPriceCategory.hasMany(Seat, { foreignKey: 'seatPriceCategoryId' });
}
