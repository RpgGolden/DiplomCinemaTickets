import { Router } from 'express';
import { asyncRoute } from '../utils/errors.js';
import checkRole from '../middlewares/checkRoles.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import roles from '../config/roles.js';
import hallController from '../controllers/hall.js';

const router = Router();

router
    .route('/createHall')
    .post(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT])),
        asyncRoute(hallController.createHall)
    );

router
    .route('/getAllHalls')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT])),
        asyncRoute(hallController.getHalls)
    );

router
    .route('/getHall/:id')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT])),
        asyncRoute(hallController.getHallById)
    );

router
    .route('/deleteHall/:id')
    .delete(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT])),
        asyncRoute(hallController.deleteHall)
    );

router
    .route('/createSession')
    .post(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT])),
        asyncRoute(hallController.createSessionWithSeats)
    );

export default router;
