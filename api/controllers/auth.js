import bcrypt from 'bcrypt';
import AuthDto from '../dtos/auth-dto.js';
import { AppErrorAlreadyExists, AppErrorMissing } from '../utils/errors.js';
import User from '../models/user.js';
import jwtUtils from '../utils/jwt.js';

import 'dotenv/config';
import UserPaymentMethod from '../models/user-payment-methods.js';
import UserBonus from '../models/user-bonus.js';
import roles from '../config/roles.js';

export default {
    async register(req, res) {
        try {
            const { name, surname, patronymic, email, password } = req.body;

            if (!name || !surname || !patronymic || !email || !password) {
                throw new AppErrorMissing('No name, surname, email or password');
            }

            // Проверяем, существует ли пользователь с таким же логином
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new AppErrorAlreadyExists('User already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({ name, surname, patronymic, email, password: hashedPassword, role: roles.CLIENT });
            await UserBonus.create({ userId: user.id });

            // Создаем объект paymentMethods
            const paymentMethods = {
                cash: { userId: user.id, methodType: 'cash' },
                bonus: { userId: user.id, methodType: 'bonus' },
            };

            // Сохраняем методы оплаты в базе данных
            await UserPaymentMethod.bulkCreate(Object.values(paymentMethods));

            // Генерируем и сохраняем JWT-токены
            const { accessToken, refreshToken } = jwtUtils.generate({ id: user.id });
            await jwtUtils.saveToken(user.id, refreshToken);

            // Получаем пользователя с методами оплаты
            const userData = await User.findByPk(user.id, { include: [{ model: UserPaymentMethod }] });

            // Формируем ответ
            const authDto = new AuthDto(userData);
            return res.json({
                ...authDto,
                accessToken,
                refreshToken,
                paymentMethods: userData.UserPaymentMethods,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async registerAdmin(req, res) {
        try {
            const { name, surname, patronymic, email, password } = req.body;

            if (!name || !surname || !patronymic || !email || !password) {
                throw new AppErrorMissing('No name, surname, email or password');
            }

            // Проверяем, существует ли пользователь с таким же логином
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new AppErrorAlreadyExists('User already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // Создаем пользователя без бонусов и методов оплаты
            const user = await User.create({ name, surname, patronymic, email, password: hashedPassword, role: roles.ADMINISTRATOR });

            // Генерируем и сохраняем JWT-токены
            const { accessToken, refreshToken } = jwtUtils.generate({ id: user.id });
            await jwtUtils.saveToken(user.id, refreshToken);

            // Получаем пользователя без методов оплаты
            const userData = await User.findByPk(user.id);

            // Формируем ответ
            const authDto = new AuthDto(userData);
            return res.json({
                ...authDto,
                accessToken,
                refreshToken,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async deleteAccount(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                throw new AppErrorAlreadyExists('User not found');
            }

            await user.destroy({
                force: true
            });

            return res.status(200).json({ message: 'Аккаунт удален' });
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Internal server error' });
        }
    },
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

    async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new AppErrorMissing('No login or password');
        }

        const user = await User.findOne({
            where: { email },
            include: [{ model: UserPaymentMethod }],
        });

        if (!user) {
            throw new AppErrorMissing('User not found');
        }

        // Проверка пароля
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppErrorMissing('Wrong password');
        }

        // Генерация access и refresh токенов
        const { accessToken, refreshToken } = jwtUtils.generate({ id: user.id });
        await jwtUtils.saveToken(user.id, refreshToken);

        // Возврат ответа с токенами, информацией о пользователе и методами оплаты
        const authDto = new AuthDto(user);
        return res.json({ ...authDto, accessToken, refreshToken, userPaymentMethod: user.UserPaymentMethods || null });
    },
    async logout(req, res) {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new AppErrorMissing('No refresh token');
        }

        try {
            jwtUtils.verifyRefreshToken(refreshToken);

            await jwtUtils.removeToken(refreshToken);

            return res.json({ success: true });
        } catch (error) {
            throw new AppErrorMissing('Invalid refresh token');
        }
    },
    async refreshToken(req, res) {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new AppErrorMissing('No refresh token');
        }

        try {
            const { id } = jwtUtils.verifyRefreshToken(refreshToken);

            const tokenData = await jwtUtils.findToken(refreshToken);
            if (!tokenData) {
                throw new AppErrorMissing('Invalid refresh token');
            }

            const { accessToken, refreshToken: newRefreshToken } = jwtUtils.generate({ id });
            await jwtUtils.saveToken(id, newRefreshToken);

            return res.json({ accessToken, refreshToken: newRefreshToken });
        } catch (error) {
            throw new AppErrorMissing('Invalid refresh token');
        }
    },
};
