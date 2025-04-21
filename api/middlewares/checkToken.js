import jwtUtils from '../utils/jwt.js';
import { AppErrorInvalid } from '../utils/errors.js';

// Удаляем "default" перед "function"
export const authenticateToken = async (req, res, next) => {
    try {
        // Получаем токен из заголовка Authorization
        const authHeader = req.headers.authorization;
        const token = authHeader
        if (!token) {
            throw new AppErrorInvalid('No token provided');
        }
        
        const decoded = await jwtUtils.verifyAccessToken(token);
        
        // Передаем информацию о пользователе в запрос для последующих обработчиков
        req.user = decoded;

        console.log(req.user);

        next();
    } catch (error) {
        next(error); // Передаем ошибку дальше для обработки централизованной обработки ошибок
    }
};
