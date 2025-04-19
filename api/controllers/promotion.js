import { AppErrorAlreadyExists, AppErrorMissing } from '../utils/errors.js';
import Promotion from '../models/promotions.js';
import 'dotenv/config';
import path from 'path';
import PromotionDto from '../dtos/promotion-dto.js';
import { deleteFromPinata, uploadToPinata } from '../ipfs-client/ipfsClient.js';

export default {
    async createPromotion(req, res) {
        try {
            const { title, description, endDate } = req.body;
            const image = req.file ? path.posix.join('uploads', 'promotions', req.file.filename) : null;
            if (!title || !description || !endDate) {
                throw new AppErrorMissing('Не все данные заполнены');
            }

            const existingPromotion = await Promotion.findOne({ where: { title } });
            if (existingPromotion) {
                throw new AppErrorAlreadyExists('Такая акция уже существует');
            }

            let ipfsHash = null;
            if (image) {
                const pinataResponse = await uploadToPinata(image, 'promotions', { category: 'Promotion' });
                ipfsHash = pinataResponse.IpfsHash;
            }

            const promotion = await Promotion.create({
                title,
                description,
                image: ipfsHash,
                isOutput: false,
                endDate,
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
            const { title, description, isOutput, endDate } = req.body;
            const image = req.file ? path.posix.join('uploads', 'promotions', req.file.filename) : null;

            const promotion = await Promotion.findOne({ where: { id } });

            if (!promotion) {
                return res.status(404).json({ error: 'Акция не найдена' });
            }

            if (image && promotion.image) {
                await deleteFromPinata(promotion.image);
                const pinataResponse = await uploadToPinata(image, 'promotions', { category: 'Promotion' });
                promotion.image = pinataResponse.IpfsHash;
            }

            promotion.title = title || promotion.title;
            promotion.description = description || promotion.description;
            promotion.isOutput = isOutput !== undefined ? isOutput : promotion.isOutput;
            promotion.endDate = endDate || promotion.endDate;

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
                order: [['endDate', 'ASC']],
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

    async getAllPromotionsForSite(req, res) {
        try {
            const promotionsList = await Promotion.findAll({
                order: [['endDate', 'ASC']],
                where: {
                    isOutput: true,
                },
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

            if (promotion.image) {
                await deleteFromPinata(promotion.image);
            }

            await promotion.destroy({ force: true });

            res.json({ message: 'Акция успешно удалена' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deletePromotions(req, res) {
        try {
            const promotionIds = req.body.ids;

            if (!Array.isArray(promotionIds) || promotionIds.length === 0) {
                return res.status(400).json({ error: 'No promotion IDs provided' });
            }

            const promotions = await Promotion.findAll({ where: { id: promotionIds } });

            const deletedImages = new Set();

            for (const promotion of promotions) {
                if (promotion.image && !deletedImages.has(promotion.image)) {
                    await deleteFromPinata(promotion.image);
                    deletedImages.add(promotion.image);
                }
            }

            await Promotion.destroy({ where: { id: promotionIds }, force: true });

            res.json({ message: 'Акции успешно удалены' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
