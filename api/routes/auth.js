import { Router } from 'express';
import authController from '../controllers/auth.js';
import { asyncRoute } from '../utils/errors.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import checkRole from '../middlewares/checkRoles.js';
import roles from '../config/roles.js';

const router = Router();

router.route('/register').post(asyncRoute(authController.register));

router.route('/registerAdmin').post(asyncRoute(authController.registerAdmin));

router.route('/login').post(asyncRoute(authController.login));

router.route('/logout').post(asyncRoute(authController.logout));

router.route('/refresh').post(authenticateToken, asyncRoute(authController.refreshToken));

router
    .route('/updateProfile')
    .post(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        asyncRoute(authController.updateProfile)
    );

router
    .route('/addPaymentMethod')
    .post(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        asyncRoute(authController.addPaymentMethod)
    );

router
    .route('/deleteAccount/:id')
    .delete(
        authenticateToken,
        asyncRoute(checkRole([roles.SUPERADMIN])),
        asyncRoute(authController.deleteAccount)
    );

export default router;
