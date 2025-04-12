import { AppErrorMissing } from '../utils/errors.js';
import path from 'path';
import SliderDto from '../dtos/slider-DTO.js';
import Slider from '../models/sliders.js';
import 'dotenv/config';
export default {
    async createSlider(req, res) {
        try {
            const images = req.files ? req.files.map(file => path.posix.join('uploads', 'sliders', file.filename)) : [];
            if (!images) {
                throw new AppErrorMissing('Не все данные заполнены');
            }
            console.log(images);

            const slider = await Slider.create({ images });
            const sliderDto = new SliderDto(slider, process.env.HOST);
            return res.json(sliderDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getSliders(req, res) {
        try {
            const sliders = await Slider.findAll();
            const slidersDto = sliders.map(slider => new SliderDto(slider, process.env.HOST));
            return res.json(slidersDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getSlider(req, res) {
        try {
            const slider = await Slider.findByPk(req.params.id);
            if (!slider) {
                return res.status(404).json({ error: 'Slider not found' });
            }
            const sliderDto = new SliderDto(slider, process.env.HOST);
            return res.json(sliderDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async deleteSlider(req, res) {
        try {
            const slider = await Slider.findByPk(req.params.id);
            if (!slider) {
                return res.status(404).json({ error: 'Slider not found' });
            }
            await slider.destroy({ force: true });
            return res.json({ message: 'Слайдер успешно удалён' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async deleteSliders(req, res) {
        try {
            const sliderIds = req.body.ids;
            if (!Array.isArray(sliderIds) || sliderIds.length === 0) {
                return res.status(400).json({ error: 'No slider IDs provided' });
            }
            await Slider.destroy({ where: { id: sliderIds } }, { force: true });
            res.json({ message: 'Слайдеры успешно удалены' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async updateSlider(req, res) {
        try {
            const slider = await Slider.findByPk(req.params.id);
            if (!slider) {
                return res.status(404).json({ error: 'Slider not found' });
            }
            const images = req.files
                ? req.files.map(file => path.posix.join('uploads', 'sliders', file.filename))
                : slider.images;
            slider.images = images || slider.images;
            await slider.save();
            const sliderDto = new SliderDto(slider, process.env.HOST);
            return res.json(sliderDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};
