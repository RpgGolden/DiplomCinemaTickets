import { Router } from 'express';
import movieController from '../controllers/movie.js';
import { asyncRoute } from '../utils/errors.js';
import checkRole from '../middlewares/checkRoles.js';
import { authenticateToken } from '../middlewares/checkToken.js';
import roles from '../config/roles.js';
import upload from '../utils/multerConfig.js';

const router = Router();

router.route('/createMovie').post(
    authenticateToken,
    asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
    upload.array('images'), // Используем array для загрузки нескольких изображений
    asyncRoute(movieController.createMovie)
);

router.route('/getMovie/:id').get(asyncRoute(movieController.getMovie));

router.route('/updateMovie/:id').patch(
    authenticateToken,
    asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
    upload.array('images'), // Используем array для загрузки нескольких изображений
    asyncRoute(movieController.updateMovie)
);

router.route('/getAllMovies').get(asyncRoute(movieController.getAllMovies));

router.route('/findMovieByTitle').get(asyncRoute(movieController.findMovieByTitle));

router.route('/getHits').get(asyncRoute(movieController.getHits));

router.route('/comingSoon').get(asyncRoute(movieController.comingSoon));

router
    .route('/deleteMovie/:id')
    .delete(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        asyncRoute(movieController.deleteMovie)
    );

router
    .route('/deleteMovies')
    .delete(
        authenticateToken,
        asyncRoute(checkRole([roles.ADMINISTRATOR, roles.CLIENT, roles.SUPERADMIN])),
        asyncRoute(movieController.deleteMovies)
    );
export default router;
