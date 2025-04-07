import { Router } from 'express';
import ticketsController from '../controllers/ticket.js';
import { asyncRoute } from '../utils/errors.js';
import checkRole from '../middlewares/checkRoles.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import roles from '../config/roles.js';

const router = Router();

router
    .route('/bookingTickets')
    .post(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        asyncRoute(ticketsController.createTicket)
    );

router
    .route('/cancelTicket/:id')
    .delete(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        asyncRoute(ticketsController.cancelTicket)
    );

router
    .route('/getAllTickets')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        asyncRoute(ticketsController.getAllTickets)
    );

router
    .route('/getAllTicketsUser')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        asyncRoute(ticketsController.getAllTicketsUser)
    );

router
    .route('/getTicket/:id')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT], roles.SUPERADMIN)),
        asyncRoute(ticketsController.getTicket)
    );
export default router;
