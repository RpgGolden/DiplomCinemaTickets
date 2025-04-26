import { AppErrorMissing } from '../utils/errors.js';
import path from 'path';
import SliderDto from '../dtos/slider-DTO.js';
import Slider from '../models/sliders.js';
import 'dotenv/config';
import { deleteFromPinata, uploadToPinata } from '../ipfs-client/ipfsClient.js';

export default {
    async createSlider(req, res) {
        try {
            const { priority } = req.body;
            const image = req.file ? path.posix.join('uploads', 'sliders', req.file.filename) : null;
            if (!image) {
                throw new AppErrorMissing('Изображение не загружено');
            }

            const pinataResponse = await uploadToPinata(image, 'sliders', { category: 'Slider' });
            const ipfsHash = pinataResponse.IpfsHash;

            const slider = await Slider.create({ image: ipfsHash, priority });
            const sliderDto = new SliderDto(slider, process.env.HOST);
            return res.json(sliderDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getSliders(req, res) {
        try {
            const sliders = await Slider.findAll({
                order: [['createdAt', 'DESC']],
            });
            const slidersDto = sliders.map(slider => new SliderDto(slider, process.env.HOST));
            return res.json(slidersDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
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
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deleteSlider(req, res) {
        try {
            const { id } = req.params;
            const slider = await Slider.findByPk(id);
            if (!slider) {
                return res.status(404).json({ error: 'Slider not found' });
            }

            if (slider.image) {
                await deleteFromPinata(slider.image);
            }

            await slider.destroy({ force: true });
            return res.json({ message: 'Слайдер успешно удалён' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deleteSliders(req, res) {
        try {
            const sliderIds = req.body.ids;
            if (!Array.isArray(sliderIds) || sliderIds.length === 0) {
                return res.status(400).json({ error: 'No slider IDs provided' });
            }

            const sliders = await Slider.findAll({ where: { id: sliderIds } });

            for (const slider of sliders) {
                if (slider.image) {
                    await deleteFromPinata(slider.image);
                }
            }

            await Slider.destroy({ where: { id: sliderIds }, force: true });
            res.json({ message: 'Слайдеры успешно удалены' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async updateSlider(req, res) {
        try {
            const slider = await Slider.findByPk(req.params.id);
            if (!slider) {
                return res.status(404).json({ error: 'Slider not found' });
            }
            const { priority } = req.body;
            const newImage = req.file ? path.posix.join('uploads', 'sliders', req.file.filename) : null;

            if (newImage) {
                if (slider.image) {
                    await deleteFromPinata(slider.image);
                }

                const pinataResponse = await uploadToPinata(newImage, 'sliders', { category: 'Slider' });
                slider.image = pinataResponse.IpfsHash;
            }
            slider.priority = priority || slider.priority;
            await slider.save();
            const sliderDto = new SliderDto(slider, process.env.HOST);
            return res.json(sliderDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getSlidersForSite(req, res) {
        try {
            const sliders = await Slider.findAll({
                order: [['priority', 'DESC']],
            });
            const slidersDto = sliders.map(slider => new SliderDto(slider, process.env.HOST));
            return res.json(slidersDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async changeStatusSlider(req, res) {
        try {
            const { id } = req.params;
            const slider = await Slider.findByPk(id);
            if (!slider) {
                return res.status(404).json({ error: 'Slider not found' });
            }
            await slider.update({ status: !slider.status });
            const sliderDto = new SliderDto(slider, process.env.HOST);
            return res.json(sliderDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
