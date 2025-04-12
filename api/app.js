import express from 'express';
import cookieParser from 'cookie-parser';
import corsMiddleware from './middlewares/cors.js';
import dbUtils from './utils/db.js';
import authRoute from './routes/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';
import newsRoute from './routes/news.js';
import 'dotenv/config';
import ticketsRoute from './routes/ticket.js';
import hallRoute from './routes/hall.js';
import movieRoute from './routes/movie.js';
import sessionRoute from './routes/session.js';
import userBonusRoute from './routes/user-bonus.js';
import profileRoute from './routes/profile.js';
import sliderRoute from './routes/sliders.js';
import promotionRoute from './routes/promotion.js';
import '../api/utils/cron/cronJobs.js'

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async function initDb() {
    try {
        await dbUtils.initializeDbModels();
    } catch (e) {
        console.log(e);
        console.log('COULD NOT CONNECT TO THE DB, retrying in 5 seconds');
        setTimeout(initDb, 5000);
    }
})();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(corsMiddleware);

app.use('/auth', authRoute);
app.use('/news', newsRoute);
app.use('/hall', hallRoute);
app.use('/movie', movieRoute);
app.use('/session', sessionRoute);
app.use('/tickets', ticketsRoute);
app.use('/userBonus', userBonusRoute);
app.use('/profile', profileRoute);
app.use('/slider', sliderRoute);
app.use('/promotion', promotionRoute);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => console.log(`Listen on :${PORT}`));
