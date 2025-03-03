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
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK])),
        asyncRoute(hallController.createHall)
    );

router
    .route('/getAllHalls')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK])),
        asyncRoute(hallController.getHalls)
    );

router
    .route('/getHall/:id')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK])),
        asyncRoute(hallController.getHallById)
    );

router
    .route('/deleteHall/:id')
    .delete(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.COOK])),
        asyncRoute(hallController.deleteHall)
    );
export default router;
