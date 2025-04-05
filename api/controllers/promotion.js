import { AppErrorAlreadyExists, AppErrorMissing } from '../utils/errors.js';
import Promotion from '../models/promotion.js';
import 'dotenv/config';
import path from 'path';
import PromotionDto from '../dtos/promotion-dto.js';
import moment from 'moment-timezone';
export default {
    async createPromotion(req, res) {
        try {
            const { description, discountPercentage, conditions, startDate, endDate } = req.body;
            const image = req.file ? path.posix.join('uploads', 'promotions', req.file.filename) : null;
            if (!description || !discountPercentage || !conditions) {
                throw new AppErrorMissing('Не все данные заполнены');
            }

            const existingPromotion = await Promotion.findOne({ where: { description } });
            if (existingPromotion) {
                throw new AppErrorAlreadyExists('Такая акция уже существует');
            }

            let formattedStartDate = null;
            let formattedEndDate = null;

            if (startDate) {
                const startDateObj = new Date(startDate);
                formattedStartDate = startDateObj.setHours(startDateObj.getHours() + 3); // Add 3 hours
            }

            if (endDate) {
                const endDateObj = new Date(endDate);
                formattedEndDate = endDateObj.setHours(endDateObj.getHours() + 3); // Add 3 hours
            }

            const promotion = await Promotion.create({
                description,
                discountPercentage,
                conditions,
                image,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                status: false, // Устанавливаем статус по умолчанию в false
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
            const { description, discountPercentage, conditions, startDate, endDate, status } = req.body;
            const image = req.file ? path.posix.join('uploads', 'promotions', req.file.filename) : null;

            const promotion = await Promotion.findOne({ where: { id } });

            if (!promotion) {
                return res.status(404).json({ error: 'Акция не найдена' });
            }

            promotion.description = description || promotion.description;
            promotion.discountPercentage = discountPercentage || promotion.discountPercentage;
            promotion.conditions = conditions || promotion.conditions;
            promotion.image = image || promotion.image;

            if (status === '0' || 0) {
                promotion.status = false;
            } else {
                promotion.status = status || promotion.status;
            }

            if (startDate) {
                const formattedStartDate = new Date(startDate);
                formattedStartDate.setHours(formattedStartDate.getHours() + 3);
                promotion.startDate = formattedStartDate;
            }

            if (endDate) {
                const formattedEndDate = new Date(endDate);
                formattedEndDate.setHours(formattedEndDate.getHours() + 3);
                promotion.endDate = formattedEndDate;
            }

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
            const promotionWithoutTZ = {
                ...promotionDto,
                startDate: moment(promotionDto.startDate).tz('UTC').format('YYYY-MM-DD HH:mm'),
                endDate: moment(promotionDto.endDate).tz('UTC').format('YYYY-MM-DD HH:mm'),
            };

            res.json(promotionWithoutTZ);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getAllPromotions(req, res) {
        try {
            const promotions = await Promotion.findAll({
                order: [['createdAt', 'DESC']],
            });

            const promotionsWithDtos = promotions.map(promotion => {
                const promotionDto = new PromotionDto(promotion, process.env.HOST);
                return {
                    ...promotionDto,
                    startDate: moment(promotionDto.startDate).tz('UTC').format('YYYY-MM-DD HH:mm'),
                    endDate: moment(promotionDto.endDate).tz('UTC').format('YYYY-MM-DD HH:mm'),
                };
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
