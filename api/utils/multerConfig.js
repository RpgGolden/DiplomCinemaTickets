import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Determine the folder based on the route or other request parameters
        let folder = 'uploads'; // Default folder
        if (req.baseUrl.includes('/movie')) {
            folder = path.join('uploads', 'movies');
        } else if (req.baseUrl.includes('/promotion')) {
            folder = path.join('uploads', 'promotions');
        }
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = uuidv4();
        const originalName = file.originalname;
        const extension = originalName.substring(originalName.lastIndexOf('.'));
        cb(null, `${uniqueSuffix}${extension}`);
    },
});

const upload = multer({ storage });

export default upload;
