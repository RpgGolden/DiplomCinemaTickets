import { AppErrorAlreadyExists, AppErrorMissing } from '../utils/errors.js';
import Promotion from '../models/promotions.js';
import 'dotenv/config';
import path from 'path';
import PromotionDto from '../dtos/promotion-dto.js';

export default {
    async createPromotion(req, res) {
        try {
            const { title, description, endDate } = req.body; // Добавляем endDate
            const image = req.file ? path.posix.join('uploads', 'promotions', req.file.filename) : null;
            if (!title || !description || !endDate) {
                // Проверяем наличие endDate
                throw new AppErrorMissing('Не все данные заполнены');
            }

            const existingPromotion = await Promotion.findOne({ where: { title } });
            if (existingPromotion) {
                throw new AppErrorAlreadyExists('Такая акция уже существует');
            }

            const promotion = await Promotion.create({
                title,
                description,
                image,
                isOutput: false, // Устанавливаем статус по умолчанию в false
                endDate, // Сохраняем endDate
            });

            const promotionDto = new PromotionDto(promotion, process.env.HOST);
            res.json(promotionDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async updatePromotion(req, res) {
        try {
            const { id } = req.params;
            const { title, description, isOutput, endDate } = req.body; // Добавляем endDate
            const image = req.file ? path.posix.join('uploads', 'promotions', req.file.filename) : null;

            const promotion = await Promotion.findOne({ where: { id } });

            if (!promotion) {
                return res.status(404).json({ error: 'Акция не найдена' });
            }

            promotion.title = title || promotion.title;
            promotion.description = description || promotion.description;
            promotion.image = image || promotion.image;
            promotion.isOutput = isOutput !== undefined ? isOutput : promotion.isOutput;
            promotion.endDate = endDate || promotion.endDate; // Обновляем endDate

            await promotion.save();

            const promotionDto = new PromotionDto(promotion, process.env.HOST);
            res.json(promotionDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error', message: 'Ошибка при обновлении акции' });
        }
    },

    async getPromotion(req, res) {
        try {
            const promotion = await Promotion.findOne({ where: { id: req.params.id } });

            if (!promotion) {
                return res.status(404).json({ error: 'Акция не найдена' });
            }

            const promotionDto = new PromotionDto(promotion, process.env.HOST);
            res.json(promotionDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getAllPromotions(req, res) {
        try {
            const promotionsList = await Promotion.findAll({
                order: [['endDate', 'DESC']],
            });

            const promotionsWithDtos = promotionsList.map(promotion => {
                const promotionDto = new PromotionDto(promotion, process.env.HOST);
                return promotionDto;
            });

            res.json(promotionsWithDtos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deletePromotion(req, res) {
        try {
            const promotion = await Promotion.findOne({ where: { id: req.params.id } });

            if (!promotion) {
                return res.status(404).json({ error: 'Акция не найдена' });
            }

            await promotion.destroy({ force: true });

            res.json({ message: 'Акция успешно удалена' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
