import express from 'express';
import UsersRouter from './user.router.js'
import ReservationRouter from './reservation.router.js'
import ReviewRouter from './review.router.js'
import PetRouter from './pet.router.js'
import SitterRouter from './sitter.router.js'
const router = express.Router();


router.use('/users/', UsersRouter);
router.use('/reservations/', ReservationRouter)
router.use('/reviews/', ReviewRouter)
router.use('/pets/', PetRouter)
router.use('/sitters/', SitterRouter)

export default router;
