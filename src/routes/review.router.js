import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { ReviewsController } from '../controllers/review.controller.js'
import { ReviewsService } from '../services/review.services.js'
import { ReviewsRepository } from '../repositories/review.repositories.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import { SittersRepository } from '../repositories/sitter.repositories.js';

const sittersRepository = new SittersRepository(prisma)
const reviewsRepository = new ReviewsRepository(prisma);
const reviewsService = new ReviewsService(reviewsRepository, sittersRepository);
const reviewsController = new ReviewsController(reviewsService);

const router = express.Router();

// 리뷰 작성 API
router.post('/make', authMiddleware, reviewsController.createReview)

// 리뷰 수정 API
router.put('/update/:reviewId', authMiddleware, reviewsController.updateReview)

// 리뷰 삭제 API
router.delete('/cancle/:reviewId', authMiddleware, reviewsController.deleteReview)


export default router
