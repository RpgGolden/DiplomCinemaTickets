import { AppErrorAlreadyExists, AppErrorMissing } from '../utils/errors.js';
import User from '../models/user.js';
import path from 'path';

import 'dotenv/config';
import UserPaymentMethod from '../models/user-payment-methods.js';
import { UserDto, ProfileAdminDto } from '../dtos/profile-dto.js';
import roles from '../config/roles.js';
export default {
    async addPaymentMethod(req, res) {
        try {
            const { methodType, details } = req.body;

            const userId = req.user.id;

            if (!userId || !methodType) {
                throw new AppErrorMissing('User ID and payment method type are required');
            }
            if (methodType !== 'cards') {
                throw new AppErrorMissing('Payment method type must be "cards"');
            }
            // Проверяем, существует ли пользователь
            const user = await User.findByPk(userId);

            if (!user) {
                throw new AppErrorAlreadyExists('User not found');
            }
            const existingCard = await UserPaymentMethod.findOne({
                where: {
                    userId,
                    methodType: 'cards',
                    details: {
                        card_number: details.card_number,
                        expiry_date: details.expiry_date,
                    },
                },
            });

            if (existingCard) {
                throw new AppErrorAlreadyExists('Card already exists for this user');
            }
            // Создаем новый метод оплаты
            await UserPaymentMethod.create({ userId, methodType, details });

            return res.status(201).json({ message: 'Payment method added successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async deletePaymentMethod(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            // Проверяем, существует ли метод оплаты
            const paymentMethod = await UserPaymentMethod.findOne({
                where: {
                    id,
                    methodType: 'cards',
                    userId,
                },
            });

            if (!paymentMethod) {
                throw new AppErrorAlreadyExists('Payment method not found');
            }

            // Удаляем метод оплаты
            await paymentMethod.destroy();

            return res.status(200).json({ message: 'Карта успешно удалена' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async updateProfile(req, res) {
        try {
            const { name, surname, patronymic } = req.body;
            const userId = req.user.id;

            if (!userId || !name || !surname || !patronymic) {
                throw new AppErrorMissing('User ID, name, surname, and patronymic are required');
            }

            // Проверяем, существует ли пользователь
            const user = await User.findByPk(userId);

            if (!user) {
                throw new AppErrorAlreadyExists('User not found');
            }

            // Обновляем информацию о пользователе
            await user.update({ name, surname, patronymic });

            return res.status(200).json({ message: 'Profile updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getProfile(req, res) {
        try {
            const userId = req.user.id;

            // Проверяем, существует ли пользователь
            const user = await User.findByPk(userId, {
                include: [{ model: UserPaymentMethod }], // Включаем методы оплаты
            });

            if (!user) {
                throw new AppErrorAlreadyExists('User not found');
            }
            console.log(user);
            let userDto = '';
            // Создаем DTO для пользователя
            if (user.role === roles.CLIENT) {
                console.log('tyt');
                userDto = new UserDto(user, user.UserPaymentMethods);
            } else {
                userDto = new ProfileAdminDto(user);
            }

            return res.status(200).json(userDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getUserPaymentMethods(req, res) {
        try {
            const userId = req.user.id;

            // Проверяем, существует ли пользователь
            const user = await User.findByPk(userId);

            if (!user) {
                throw new AppErrorAlreadyExists('User not found');
            }

            const paymentMethods = await UserPaymentMethod.findAll({ where: { userId, methodType: 'cards' } });

            return res.status(200).json(paymentMethods);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getAllUserPaymentMethods(req, res) {
        try {
            const userId = req.user.id;

            // Проверяем, существует ли пользователь
            const user = await User.findByPk(userId);

            if (!user) {
                throw new AppErrorAlreadyExists('User not found');
            }

            const paymentMethods = await UserPaymentMethod.findAll({ where: { userId } });

            return res.status(200).json(paymentMethods);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async uploadAvatar(req, res) {
        try {
            const userId = req.user.id;
            const image = req.file ? path.posix.join('uploads', 'avatar', req.file.filename) : null;

            if (!userId || !image) {
                throw new AppErrorMissing('User ID and image are required');
            }

            // Проверяем, существует ли пользователь
            const user = await User.findByPk(userId);

            if (!user) {
                throw new AppErrorMissing('User not found');
            }

            // Обновляем информацию о пользователе
            await user.update({ avatar: image });

            return res.status(200).json({ message: 'Avatar uploaded successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getAllUsers(req, res) {
        try {
            const currentUser = await User.findByPk(req.user.id);

            let whereCondition = {};
            if (currentUser.role === roles.SUPERADMIN) {
                whereCondition = {};
            } else if (currentUser.role === roles.ADMINISTRATOR) {
                whereCondition = { role: roles.CLIENT };
            }

            const users = await User.findAll({
                where: whereCondition,
                include: [{ model: UserPaymentMethod }],
                order: [['role', 'DESC']],
            });

            const usersDto = users.map(user => new UserDto(user, user.UserPaymentMethods));
            return res.status(200).json(usersDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};
