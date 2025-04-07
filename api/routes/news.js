import { Router } from 'express';
import newsController from '../controllers/news.js';
import { asyncRoute } from '../utils/errors.js';
import checkRole from '../middlewares/checkRoles.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import roles from '../config/roles.js';
import upload from '../utils/multerConfig.js';

const router = Router();

router
    .route('/createNews')
    .post(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        upload.single('image'),
        asyncRoute(newsController.createNews)
    );

router.route('/getNews/:id').get(asyncRoute(newsController.getNews));

router
    .route('/updateNews/:id')
    .patch(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        upload.single('image'),
        asyncRoute(newsController.updateNews)
    );

router.route('/getAllNews').get(asyncRoute(newsController.getAllNews));
router
    .route('/deleteNews/:id')
    .delete(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        asyncRoute(newsController.deleteNews)
    );

export default router;
