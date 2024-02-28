import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { ReviewsController } from "../controllers/review.controller.js";
import { ReviewsService } from "../services/review.services.js";
import { redisClient } from '../redis/client.js';
import { ReviewsRepository } from "../repositories/review.repositories.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { SittersRepository } from "../repositories/sitter.repositories.js";
import { UsersRepository } from "../repositories/user.repositories.js"

const usersRepository = new UsersRepository(prisma, redisClient)
const sittersRepository = new SittersRepository(prisma, redisClient);
const reviewsRepository = new ReviewsRepository(prisma);
const reviewsService = new ReviewsService(reviewsRepository, sittersRepository, usersRepository);
const reviewsController = new ReviewsController(reviewsService);

const router = express.Router();

// 리뷰 작성 API
router.post("/make/:sitterId", authMiddleware, reviewsController.createReview);

// 리뷰 수정 API
router.patch("/update/:reviewId", authMiddleware, reviewsController.updateReview);

// 리뷰 삭제 API
router.delete("/delete/:reviewId", authMiddleware, reviewsController.deleteReview);

export default router;