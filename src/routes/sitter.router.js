import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { redisClient } from '../redis/client.js';
import { SittersController } from '../controllers/sitter.controller.js';
import { SittersService } from '../services/sitter.services.js'
import { SittersRepository } from '../repositories/sitter.repositories.js';
import { ReviewsRepository } from '../repositories/review.repositories.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

const reviewsRepository = new ReviewsRepository(prisma);
const sittersRepository = new SittersRepository(prisma, redisClient);
const sittersService = new SittersService(sittersRepository, reviewsRepository);
const sittersController = new SittersController(sittersService);

router.get('/sitter', authMiddleware, sittersController.get);


export default router
