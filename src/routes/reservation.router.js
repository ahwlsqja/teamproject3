import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { redisClient } from '../redis/client.js';
import { ReservationsController } from '../controllers/reservation.controller.js';
import { ReservationsService } from '../services/reservation.services.js';
import { ReservationsRepository } from '../repositories/reservation.repositories.js';
import authMiddleware from '../middlewares/auth.middleware.js';


const router = express.Router();

const reservationsRepository = new ReservationsRepository(prisma);
const reservationsService = new ReservationsService(reservationsRepository);
const reservationsController = new ReservationsController(reservationsService);

router.post('/reservation', authMiddleware, reservationsController.reserveByUser)