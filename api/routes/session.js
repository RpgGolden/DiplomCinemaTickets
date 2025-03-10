import { Router } from 'express';
import { asyncRoute } from '../utils/errors.js';
import checkRole from '../middlewares/checkRoles.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import roles from '../config/roles.js';
import sessionController from '../controllers/session.js';

const router = Router();

router
    .route('/createSession')
    .post(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK])),
        asyncRoute(sessionController.createSessionWithSeats)
    );

export default router;
