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
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT])),
        asyncRoute(ticketsController.createTicket)
    );
export default router;
