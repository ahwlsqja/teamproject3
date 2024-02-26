import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { UsersRepository } from '../repositories/user.repositories.js';
import { ReservationsController } from '../controllers/reservation.controller.js';
import { ReservationsService } from '../services/reservation.services.js';
import { ReservationsRepository } from '../repositories/reservation.repositories.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import authMiddlewareSitter from '../middlewares/auth.middleware.sitter.js';


const router = express.Router();

const usersRepository = new UsersRepository(prisma, redisClient);
const reservationsRepository = new ReservationsRepository(prisma);
// UsersRepository 에서 findByUserId 쓸라고 
const reservationsService = new ReservationsService(reservationsRepository, usersRepository);
const reservationsController = new ReservationsController(reservationsService);


// 예약 생성 API
router.post('/make', authMiddleware, reservationsController.reserveByUser)

// 유저 펫 예약 목록 조회 API
router.get('/listofuser', authMiddleware, reservationsController.findReservationsByUser)

// 시터 예약 목록 조회 API
router.get('/listofsitter', authMiddlewareSitter, reservationsController.findReservationsBySitter)

// 예약 취소 API
router.delete('/cancle/:reservationId', authMiddleware, reservationsController.cancelReservation)

// 예약 수정 API
router.put('/update/:reservationId', authMiddleware, reservationsController.updateReservation) 

// 시터 예약 수락 API
router.put('/accepted/:reservationId', authMiddlewareSitter, reservationsController.ReservationAcceptBySitter) 

export default router
