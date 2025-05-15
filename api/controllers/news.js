import { AppErrorAlreadyExists, AppErrorMissing } from '../utils/errors.js';
import News from '../models/news.js';
import 'dotenv/config';
import path from 'path';
import NewsDto from '../dtos/news-dto.js';
import { uploadToPinata, deleteFromPinata } from '../ipfs-client/ipfsClient.js';

export default {
    async createNews(req, res) {
        try {
            const { title, content } = req.body;
            const image = req.file ? path.posix.join('uploads', 'news', req.file.filename) : null;
            if (!title || !content) {
                throw new AppErrorMissing('Не все данные заполнены');
            }

            const existingNews = await News.findOne({ where: { title } });
            if (existingNews) {
                throw new AppErrorAlreadyExists('Такая новость уже существует');
            }

            let ipfsHash = null;
            if (image) {
                // Передаем группу и тег в функцию uploadToPinata
                const pinataResponse = await uploadToPinata(image, 'news', { category: 'News' });
                ipfsHash = pinataResponse.IpfsHash;
            }

            const news = await News.create({
                title,
                content,
                image: ipfsHash, // Сохраняем IPFS hash вместо локального пути
                status: false,
            });

            const newsDto = new NewsDto(news, process.env.HOST);
            res.json(newsDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async updateNews(req, res) {
        try {
            const { id } = req.params;
            const { title, content } = req.body;
            const image = req.file ? path.posix.join('uploads', 'news', req.file.filename) : null;

            const news = await News.findOne({ where: { id } });

            if (!news) {
                return res.status(404).json({ error: 'Новость не найдена' });
            }

            // Если загружается новое изображение, удаляем старое из Pinata
            if (image && news.image) {
                await deleteFromPinata(news.image);
                const pinataResponse = await uploadToPinata(image, 'news', { category: 'News' });
                news.image = pinataResponse.IpfsHash;
            }

            news.title = title || news.title;
            news.content = content || news.content;
            await news.save();

            const newsDto = new NewsDto(news, process.env.HOST);
            res.json(newsDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error', message: 'Ошибка при обновлении новости' });
        }
    },

    async updateNewsStatus(req, res) {
        try {
            const { id } = req.params;
            const news = await News.findOne({ where: { id } });

            if (!news) {
                return res.status(404).json({ error: 'Новость не найдена' });
            }

            await news.update({ status: !news.status });

            const newsDto = new NewsDto(news, process.env.HOST);
            res.json(newsDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error', message: 'Ошибка при обновлении новости' });
        }
    },

    async getNews(req, res) {
        try {
            const news = await News.findOne({ where: { id: req.params.id } });

            if (!news) {
                return res.status(404).json({ error: 'Новость не найдена' });
            }

            const newsDto = new NewsDto(news, process.env.HOST);
            res.json(newsDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getAllNews(req, res) {
        try {
            const newsList = await News.findAll({
                order: [['createdAt', 'DESC']],
            });

            const newsWithDtos = newsList.map(news => {
                const newsDto = new NewsDto(news, process.env.HOST);
                return newsDto;
            });

            res.json(newsWithDtos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getAllNewsForSite(req, res) {
        try {
            const newsList = await News.findAll({
                order: [['createdAt', 'DESC']],
                where: {
                    status: true,
                },
            });

            const newsWithDtos = newsList.map(news => {
                const newsDto = new NewsDto(news, process.env.HOST);
                return newsDto;
            });

            res.json(newsWithDtos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deleteNews(req, res) {
        try {
            const news = await News.findOne({ where: { id: req.params.id } });

            if (!news) {
                return res.status(404).json({ error: 'Новость не найдена' });
            }

            // Удаляем изображение из Pinata, если оно существует и не было удалено ранее
            if (news.image) {
                try {
                    await deleteFromPinata(news.image);  
                } catch (error) {
                    console.error(`Failed to delete image ${news.image} from Pinata:`, error);
                }
            }

            // Удаляем сущность из базы данных
            await news.destroy({ force: true });

            res.json({ message: 'Новость и изображение успешно удалены' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deleteNewsMany(req, res) {
        try {
            const newsIds = req.body.ids;
            if (!Array.isArray(newsIds) || newsIds.length === 0) {
                return res.status(400).json({ error: 'No news IDs provided' });
            }

            // Получаем все новости, которые будут удалены
            const newsList = await News.findAll({ where: { id: newsIds } });

            // Используем множество для отслеживания уже удалённых изображений
            const deletedImages = new Set();

            // Удаляем изображения из Pinata
            for (const news of newsList) {
                if (news.image && !deletedImages.has(news.image)) {
                    try {
                        await deleteFromPinata(news.image);
                        deletedImages.add(news.image);
                    } catch (error) {
                        console.error('Error deleting image from Pinata:', error);
                        continue;
                    }
                    
                }
            }

            // Удаляем сущности из базы данных
            await News.destroy({ where: { id: newsIds }, force: true });

            res.json({ message: 'Новости и изображения успешно удалены' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
