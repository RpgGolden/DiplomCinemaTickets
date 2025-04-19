import axios from 'axios';
import { randomUUID } from 'crypto';
import FormData from 'form-data';
import fs from 'fs';

async function uploadToPinata(filePath, group = 'default', metadata = {}) {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const data = new FormData();
    data.append('file', fs.createReadStream(filePath));

    // Добавляем метаданные с указанием группы и дополнительных тегов
    const pinataMetadata = JSON.stringify({
        name: randomUUID(), // Используем уникальное имя для каждого файла
        keyvalues: {
            group, // Указываем группу
            uniqueId: randomUUID(), // Добавляем уникальный идентификатор
            ...metadata, // Добавляем дополнительные метаданные, такие как теги
        },
    });

    data.append('pinataMetadata', pinataMetadata);

    const response = await axios.post(url, data, {
        maxContentLength: 'Infinity', // This is needed to prevent axios from erroring out with large files
        headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            pinata_api_key: process.env.PINATA_API_KEY,
            pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        },
    });

    return response.data;
}

async function getFileFromPinata(ipfsHash) {
    try {
        // Формируем URL для доступа к файлу через публичный IPFS-шлюз Pinata
        const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

        // Выполняем GET-запрос для получения файла
        const response = await axios.get(url, {
            responseType: 'arraybuffer', // Указываем тип ответа, если ожидаем бинарные данные
        });

        // Возвращаем данные файла
        return response.data;
    } catch (error) {
        console.error('Error fetching file from IPFS:', error);
        throw new Error('Failed to fetch file from IPFS');
    }
}

async function deleteFromPinata(ipfsHash) {
    try {
        const url = `https://api.pinata.cloud/pinning/unpin/${ipfsHash}`;

        const response = await axios.delete(url, {
            headers: {
                pinata_api_key: process.env.PINATA_API_KEY,
                pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error deleting file from Pinata:', error);
        throw new Error('Failed to delete file from Pinata');
    }
}
export { uploadToPinata, getFileFromPinata, deleteFromPinata };
