import { Router } from 'express';
import promotionController from '../controllers/promotion.js';
import { asyncRoute } from '../utils/errors.js';
import checkRole from '../middlewares/checkRoles.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import roles from '../config/roles.js';
import upload from '../utils/multerConfig.js';

const router = Router();
router
    .route('/createPromotion')
    .post(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.SUPERADMIN])),
        upload.single('image'),
        asyncRoute(promotionController.createPromotion)
    );

router.route('/getPromotion/:id').get(asyncRoute(promotionController.getPromotion));

router
    .route('/updatePromotion/:id')
    .patch(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.SUPERADMIN])),
        upload.single('image'),
        asyncRoute(promotionController.updatePromotion)
    );

router.route('/getAllPromotions').get(asyncRoute(promotionController.getAllPromotions));

router.route('/getAllPromotionsForSite').get(asyncRoute(promotionController.getAllPromotionsForSite));

router
    .route('/deletePromotion/:id')
    .delete(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.SUPERADMIN])),
        asyncRoute(promotionController.deletePromotion)
    );

router
    .route('/deletePromotions')
    .delete(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.SUPERADMIN])),
        asyncRoute(promotionController.deletePromotions)
    );

export default router;
