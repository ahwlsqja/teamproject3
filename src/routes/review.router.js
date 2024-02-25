import express from 'express';
import { prisma } from '../prisma/index.js';
import { redisClient } from '../redis/client.js';
import { ReviewsController } from '../controllers/review.controller.js';

const router = express.Router(); // express.Router()를 이용해 라우터를 생성합니다.

const reviewsController = new reviewsController();

// 댓글 작성
router.post('/', reviewsController.createReview);

// 댓글 수정
router.put('/:reviewId', reviewsController.updateReview);

// 댓글 삭제
router.delete('/:reviewId', reviewsController.deleteReview);

export default router;
