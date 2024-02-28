import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { ReviewsController } from "../controllers/review.controller.js";
import { ReviewsService } from "../services/review.services.js";
import { ReviewsRepository } from "../repositories/review.repositories.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { SittersRepository } from "../repositories/sitter.repositories.js";

const sittersRepository = new SittersRepository(prisma);
const reviewsRepository = new ReviewsRepository(prisma);
const reviewsService = new ReviewsService(reviewsRepository, sittersRepository);
const reviewsController = new ReviewsController(reviewsService);

const router = express.Router();

// 리뷰 작성 API
router.post("/make/:sitterId", authMiddleware, reviewsController.createReview);

// 리뷰 수정 API
router.patch(
  "/update/:reviewId",
  authMiddleware,
  reviewsController.updateReview
);

// 리뷰 삭제 API
router.delete(
  "/delete/:reviewId",
  authMiddleware,
  reviewsController.deleteReview
);

// 특정 userId가 작성한 리뷰 찾기
router.get(
  "/userId/:userId",
  authMiddleware,
  reviewsController.getReviewsByUserId
);

// 특정 sitterId가 받은 리뷰 모아보기
router.get(
  "/sitterId/:sitterId",
  authMiddleware,
  reviewsController.getReviewsBySitterId
);

export default router;
