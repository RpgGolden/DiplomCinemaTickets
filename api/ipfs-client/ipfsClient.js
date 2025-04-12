// ipfsClient.js
import { create } from 'ipfs-http-client';

// Создайте экземпляр клиента IPFS
const ipfs = create({ host: 'localhost', port: '5001', protocol: 'http' });

// Проверка подключения к IPFS
async function checkIPFSConnection() {
    try {
        const version = await ipfs.version();
        console.log(`IPFS client connected. Version: ${version.version}`);
    } catch (error) {
        console.error('Failed to connect to IPFS:', error);
    }
}

checkIPFSConnection();

export default ipfs;
