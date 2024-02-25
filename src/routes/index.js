import express from 'express';
import UsersRouter from './user.router.js'
import ReservationRouter from './reservation.router.js'

const router = express.Router();


router.use('/users/', UsersRouter);
router.use('/reservation/', ReservationRouter)



export default router;
