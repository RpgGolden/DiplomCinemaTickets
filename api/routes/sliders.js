import { Router } from 'express';
import { asyncRoute } from '../utils/errors.js';
import checkRole from '../middlewares/checkRoles.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import roles from '../config/roles.js';
import sliderController from '../controllers/sliders.js';
import upload from '../utils/multerConfig.js';

const router = Router();

router
    .route('/createSlider')
    .post(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        upload.array('images'),
        asyncRoute(sliderController.createSlider)
    );

router.route('/getSliders').get(authenticateToken, asyncRoute(sliderController.getSliders));

router.route('/getSlider/:id').get(authenticateToken, asyncRoute(sliderController.getSlider));

router
    .route('/deleteSlider/:id')
    .get(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        asyncRoute(sliderController.deleteSlider)
    );

router
    .route('/updateSlider/:id')
    .patch(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        upload.array('images'),
        asyncRoute(sliderController.updateSlider)
    );
export default router;
