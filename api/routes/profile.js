import { Router } from 'express';
import profileController from '../controllers/profile.js';
import { asyncRoute } from '../utils/errors.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import checkRole from '../middlewares/checkRoles.js';
import roles from '../config/roles.js';

const router = Router();

router
    .route('/getProfile')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT])),
        asyncRoute(profileController.getProfile)
    );

router
    .route('/updateProfile')
    .post(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT])),
        asyncRoute(profileController.updateProfile)
    );

router
    .route('/addPaymentMethod')
    .post(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT])),
        asyncRoute(profileController.addPaymentMethod)
    );

export default router;
