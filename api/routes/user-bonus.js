import { Router } from 'express';
import { asyncRoute } from '../utils/errors.js';
import checkRole from '../middlewares/checkRoles.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import roles from '../config/roles.js';
import userBonusController from '../controllers/user-bonus.js';

const router = Router();

router
    .route('/getBonusHistory')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        asyncRoute(userBonusController.getBonusHistory)
    );

router
    .route('/getUserBonus')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        asyncRoute(userBonusController.getUserBonus)
    );

router
    .route('/getBonusHistoryById/:id')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        asyncRoute(userBonusController.getBonusHistoryById)
    );
router
    .route('/getAllBonusHistories')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        asyncRoute(userBonusController.getAllBonusHistories)
    );

router
    .route('/getAllUserBonusesHistoryByUserId')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        asyncRoute(userBonusController.getAllUserBonusesHistoryByUserId)
    );

export default router;
