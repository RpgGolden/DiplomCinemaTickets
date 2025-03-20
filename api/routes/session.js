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
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT])),
        asyncRoute(sessionController.createSessionWithSeats)
    );

router
    .route('/getAllSession')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT])),
        asyncRoute(sessionController.getAllSessions)
    );

router
    .route('/getSession/:id')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT])),
        asyncRoute(sessionController.getSession)
    );

router
    .route('/updateSession/:id')
    .patch(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT])),
        asyncRoute(sessionController.changeStatusSession)
    );

router
    .route('/changeSeatCategory/:id')
    .patch(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT])),
        asyncRoute(sessionController.updateSessionSeatCategory)
    );

export default router;
