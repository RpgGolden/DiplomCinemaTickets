import { AppErrorAlreadyExists, AppErrorMissing } from '../utils/errors.js';
import User from '../models/user.js';

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

            // Создаем новый метод оплаты
            await UserPaymentMethod.create({ userId, methodType, details });

            return res.status(201).json({ message: 'Payment method added successfully' });
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

            let userDto = '';
            // Создаем DTO для пользователя
            if (user.role === roles.CLIENT) {
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

    async getAllUsers(req, res) {
        try {
            const users = await User.findAll({
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
