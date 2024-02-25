import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { ReservationsController } from '../controllers/reservation.controller.js';
import { ReservationsService } from '../services/reservation.services.js';
import { ReservationsRepository } from '../repositories/reservation.repositories.js';
import authMiddleware from '../middlewares/auth.middleware.js';


const router = express.Router();

const reservationsRepository = new ReservationsRepository(prisma);
const reservationsService = new ReservationsService(reservationsRepository);
const reservationsController = new ReservationsController(reservationsService);


// 예약 생성 API
router.post('/make', authMiddleware, reservationsController.reserveByUser)

// 예약 취소 API
router.delete('/cancle/:reservationId', authMiddleware, reservationsController.cancelReservation)

// 예약 수정 API
router.put('/update/:reservationId', authMiddleware, reservationsController.updateReservation) 