import 'dotenv/config';
import express from 'express';
import authRouter from './authRoutes';
import petRouter from './petRoutes';
import userRouter from './userRoutes';
import reportRouter from './reportRoutes';
import { sequelize } from '../../db';

async function main() {
    
    // await sequelize.sync({ force: true });

    const app = express();
    app.use(express.json());
    
    app.use('/auth', authRouter);
    app.use('/pet', petRouter);
    app.use('/user', userRouter);
    app.use('/report', reportRouter);


    app.listen(3000, () => {
        console.log('Servidor corriendo en el puerto 3000');
    });
};

main();