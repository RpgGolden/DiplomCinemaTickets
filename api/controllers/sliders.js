import { AppErrorMissing } from '../utils/errors.js';
import path from 'path';
import SliderDto from '../dtos/slider-DTO.js';
import Slider from '../models/sliders.js';
import 'dotenv/config';
import { deleteFromPinata, uploadToPinata } from '../ipfs-client/ipfsClient.js';

export default {
    async createSlider(req, res) {
        try {
            const image = req.file ? path.posix.join('uploads', 'sliders', req.file.filename) : null;
            if (!image) {
                throw new AppErrorMissing('Изображение не загружено');
            }

            const pinataResponse = await uploadToPinata(image, 'sliders', { category: 'Slider' });
            const ipfsHash = pinataResponse.IpfsHash;

            const slider = await Slider.create({ images: [ipfsHash] });
            const sliderDto = new SliderDto(slider, process.env.HOST);
            return res.json(sliderDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
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

            for (const image of slider.images) {
                await deleteFromPinata(image);
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

            const sliders = await Slider.findAll({ where: { id: sliderIds } });

            for (const slider of sliders) {
                // Delete images from Pinata
                for (const image of slider.images) {
                    await deleteFromPinata(image);
                }
            }

            await Slider.destroy({ where: { id: sliderIds }, force: true });
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

            const newImage = req.file ? path.posix.join('uploads', 'sliders', req.file.filename) : null;

            if (newImage) {
                for (const image of slider.images) {
                    await deleteFromPinata(image);
                }

                const pinataResponse = await uploadToPinata(newImage, 'sliders', { category: 'Slider' });
                slider.images = [pinataResponse.IpfsHash];
            }

            await slider.save();
            const sliderDto = new SliderDto(slider, process.env.HOST);
            return res.json(sliderDto);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};
