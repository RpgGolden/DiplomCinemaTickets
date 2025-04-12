import { IncomingForm } from 'formidable';
import ipfs from './ipfsClient.js';
import fs from 'fs';

// Middleware для обработки загрузки файлов
async function handleFileUpload(req, res, next) {
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Ошибка при обработке формы:', err);
            return res.status(500).send('Ошибка при обработке формы');
        }

        const ipfsHashes = [];

        try {
            for (const fileKey in files) {
                const file = files[fileKey];
                console.log('Файл:', file); // Логирование объекта файла
                console.log('Путь к файлу:', file.filepath); // Логирование пути к файлу
                const fileBuffer = fs.readFileSync(file.filepath); // Используйте file.filepath
                const result = await ipfs.add(fileBuffer);
                console.log('Результат IPFS:', result); // Логирование результата IPFS
                const ipfsHash = result.path || result.cid.toString(); // Используйте правильное свойство
                ipfsHashes.push({ hash: ipfsHash, category: 'movie' }); // Добавьте категорию, если необходимо
            }

            req.ipfsHashes = ipfsHashes; // Сохраняем IPFS хэши в объекте запроса
            next();
        } catch (error) {
            console.error('Ошибка при загрузке в IPFS:', error);
            res.status(500).send('Ошибка при загрузке файлов');
        }
    });
}

export default handleFileUpload;
