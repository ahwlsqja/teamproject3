import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { redisClient } from "../redis/client.js";
import { SittersController } from "../controllers/sitter.controller.js";
import { SittersService } from "../services/sitter.services.js";
import { SittersRepository } from "../repositories/sitter.repositories.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

const sittersRepository = new SittersRepository(prisma, redisClient);
const sittersService = new SittersService(sittersRepository);
const sittersController = new SittersController(sittersService);

//시터 회원가입
router.post("/sitter/sign-up", sittersController.signUp);

//시터 로그인
router.post("/sitter/sign-in", sittersController.signIn);

//로그아웃
router.post("/sitter/sign-out", authMiddleware, sittersController.signOut);

//시터 목록 조회(필터링&정렬)
router.get("/sitters", sittersController.getSitterList);

//시터 상세조회(리뷰까지 들어가야하나? 지금은 안 넣음)
router.get("/sitter/mypage", authMiddleware, sittersController.getSitterSelf); //시터 스스로가 보는 마이페이지
router.get("/sitter/:sitterId", sittersController.getSitterBySitterId); //다른 유저가 보는 시터의 상세페이지

//시터 정보 수정
router.patch(
  "/sitter/mypage",
  authMiddleware,
  sittersController.updateSitterInfo
);

//회원 탈퇴
router.delete(
  "/sitter/leave",
  authMiddleware,
  sittersController.deleteSitterSelf
);

export default router;
