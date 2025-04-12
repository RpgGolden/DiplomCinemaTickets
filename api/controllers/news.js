import { AppErrorAlreadyExists, AppErrorMissing } from '../utils/errors.js';
import News from '../models/news.js';
import 'dotenv/config';
import path from 'path';
import NewsDto from '../dtos/news-dto.js';

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

            const news = await News.create({
                title,
                content,
                image,
                status: false, // Устанавливаем статус по умолчанию в false
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
            const { title, content, status } = req.body;
            const image = req.file ? path.posix.join('uploads', 'news', req.file.filename) : null;

            const news = await News.findOne({ where: { id } });

            if (!news) {
                return res.status(404).json({ error: 'Новость не найдена' });
            }

            news.title = title || news.title;
            news.content = content || news.content;
            news.image = image || news.image;

            if (status === '0' || 0) {
                news.status = false;
            } else {
                news.status = status || news.status;
            }
            await news.save();

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

    async deleteNews(req, res) {
        try {
            const news = await News.findOne({ where: { id: req.params.id } });

            if (!news) {
                return res.status(404).json({ error: 'Новость не найдена' });
            }

            await news.destroy({ force: true });

            res.json({ message: 'Новость успешно удалена' });
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
            await News.destroy({ where: { id: newsIds } }, { force: true });

            res.json({ message: 'Новости успешно удалена' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
