import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
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
