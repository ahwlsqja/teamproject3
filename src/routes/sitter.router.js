import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { redisClient } from "../redis/client.js";
import { UsersRepository } from "../repositories/user.repositories.js";
import { SittersController } from "../controllers/sitter.controller.js";
import { SittersService } from "../services/sitter.services.js";
import { SittersRepository } from "../repositories/sitter.repositories.js";
import { ReviewsRepository } from "../repositories/review.repositories.js";
import { uploadUserImage } from "../middlewares/image.middleware.js";
import authSitterMiddleware from "../middlewares/auth.middleware.sitter.js";

const router = express.Router();

// 유저 Repository 의존성
const usersRepository = new UsersRepository(prisma, redisClient);
// 리뷰 Repository 의존성
const reviewsRepository = new ReviewsRepository(prisma);
// 시터 Repository 의존성
const sittersRepository = new SittersRepository(prisma, redisClient);
// 시터 Service 의존성
const sittersService = new SittersService(sittersRepository, reviewsRepository);
// 시터 Controller 의존성
const sittersController = new SittersController(sittersService);

// 회원가입 API
router.post("/sign-up", uploadUserImage, sittersController.signUp);

// 이메일 인증 API
router.patch("/sign-up-verify", sittersController.verifySignUp);

// 로그인 API
router.post("/sign-in", sittersController.signIn);

// 자동로그인 API(리프래시 토큰)
router.get("/refresh", authSitterMiddleware, sittersController.refreshToken);

// 시터 로그아웃 API
router.post("/sign-out", authSitterMiddleware, sittersController.signOut);

// 시터 목록 조회 API (경력순정렬)
router.get("/career", sittersController.getSitterList);

// 시터 평점순 목록 내림차순 API
router.get("/star", sittersController.findManySitterId);


// 시터 마이페이지 조회 API
router.get("/mypage", authSitterMiddleware, sittersController.getSitterSelf);

// 타인이 시터 상세조회 API
router.get("/detail/:sitterId", sittersController.getSitterBySitterId);

// 시터 정보 수정 API
router.patch(
  "/detail-edit",
  authSitterMiddleware,
  uploadUserImage,
  sittersController.updateSitterInfo
);

// 시터 회원탈퇴 API
router.delete(
  "/withdraw",
  authSitterMiddleware,
  sittersController.deleteSitterSelf
);

// 펫 종류 필터링 시터 목록 조회 API
router.get("/pettype", sittersController.getSittersBypetType);

// 주소 필터링 목록 조회 API
router.get("/address", sittersController.getSittersByAddress);

export default router;