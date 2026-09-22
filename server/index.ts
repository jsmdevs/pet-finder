import { config } from './src/config/env';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express from 'express';
import authRouter from './src/routes/authRoutes';
import petRouter from './src/routes/petRoutes';
import userRouter from './src/routes/userRoutes';
import reportRouter from './src/routes/reportRoutes';

async function main() {
    
    // await sequelize.sync({ force: true });

    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    
    app.use('/auth', authRouter);
    app.use('/pet', petRouter);
    app.use('/user', userRouter);
    app.use('/report', reportRouter);


    app.listen(3000, () => {
        console.log('Servidor corriendo en el puerto 3000');
    });
};

main();