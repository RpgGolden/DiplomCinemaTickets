import { Router } from 'express';
import profileController from '../controllers/profile.js';
import { asyncRoute } from '../utils/errors.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import checkRole from '../middlewares/checkRoles.js';
import roles from '../config/roles.js';
import upload from '../utils/multerConfig.js';
const router = Router();

router
    .route('/getProfile')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        asyncRoute(profileController.getProfile)
    );

router
    .route('/updateProfile')
    .post(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        asyncRoute(profileController.updateProfile)
    );

router
    .route('/addPaymentMethod')
    .post(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        asyncRoute(profileController.addPaymentMethod)
    );

router
    .route('/getAllUsers')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.SUPERADMIN])),
        asyncRoute(profileController.getAllUsers)
    );

router
    .route('/getPaymentMethods')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.SUPERADMIN, roles.CLIENT])),
        asyncRoute(profileController.getUserPaymentMethods)
    );

router
    .route('/deletePaymentMethod/:id')
    .delete(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.SUPERADMIN, roles.CLIENT])),
        asyncRoute(profileController.deletePaymentMethod)
    );

router
    .route('/uploadAvatar')
    .post(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.SUPERADMIN, roles.CLIENT])),
        upload.single('image'),
        asyncRoute(profileController.uploadAvatar)
    );

export default router;
