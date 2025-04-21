import { AppErrorMissing } from '../utils/errors.js';
import path from 'path';
import SliderDto from '../dtos/slider-DTO.js';
import Slider from '../models/sliders.js';
import 'dotenv/config';
import { deleteFromPinata, uploadToPinata } from '../ipfs-client/ipfsClient.js';
export default {
    async createSlider(req, res) {
        try {
            const images = req.files ? req.files.map(file => path.posix.join('uploads', 'sliders', file.filename)) : [];
            if (images.length === 0) {
                throw new AppErrorMissing('Не все данные заполнены');
            }

            const ipfsHashes = [];
            for (const image of images) {
                const pinataResponse = await uploadToPinata(image, 'sliders', { category: 'Slider' });
                ipfsHashes.push(pinataResponse.IpfsHash);
            }

            const slider = await Slider.create({ images: ipfsHashes });
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

            // Delete images from Pinata
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

            const newImages = req.files
                ? req.files.map(file => path.posix.join('uploads', 'sliders', file.filename))
                : [];

            // If new images are provided, upload them to Pinata and replace the existing images
            if (newImages.length > 0) {
                // Delete old images from Pinata
                for (const image of slider.images) {
                    await deleteFromPinata(image);
                }

                const newIpfsHashes = [];
                for (const image of newImages) {
                    const pinataResponse = await uploadToPinata(image, 'sliders', { category: 'Slider' });
                    newIpfsHashes.push(pinataResponse.IpfsHash);
                }
                slider.images = newIpfsHashes;
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
