import { DataTypes, Model } from 'sequelize';

export default class Ticket extends Model {
    static initialize(sequelize) {
        Ticket.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    primaryKey: true,
                },
                sessionId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'sessions',
                        key: 'id',
                    },
                },
                userId: {
                    type: DataTypes.UUID,
                    references: {
                        model: 'users',
                        key: 'id',
                    },
                },
                seatId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'seats',
                        key: 'id',
                    },
                },
                paymentMethod: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                createdAt: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.NOW,
                },
                isCancelled: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                },
                ticketStatus: {
                    type: DataTypes.ENUM('cancelled', 'purchased', 'movie_started', 'movie_ended'),
                    defaultValue: 'purchased',
                    allowNull: true,
                },
            },
            {
                sequelize,
                modelName: 'Ticket',
                tableName: 'tickets',
            }
        );
    }
}
