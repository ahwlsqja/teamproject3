import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { redisClient } from '../redis/client.js';
import { UsersRepository } from '../repositories/user.repositories.js';
import { UsersService } from '../services/user.services.js';
import { Userscontroller } from '../controllers/user.controller.js';
import { uploadUserImage } from '../middlewares/image.middleware.js'
import authMiddleware from '../middlewares/auth.middleware.js'



const router = express.Router();

const usersRepository = new UsersRepository(prisma, redisClient);
const usersService = new UsersService(usersRepository);
const userscontroller = new Userscontroller(usersService);

// 회원가입 API
router.post('/sign-up', uploadUserImage, userscontroller.signUp)

// 이메일 인증 API
router.patch('/sign-up-verify', userscontroller.verifySignUp)

// 로그인 API
router.post('/sign-in', userscontroller.signIn)

// 로그아웃 API
router.post('/log-out', userscontroller.signOut)

// 자동로그인 API(리프래시 토큰)
router.post('/refresh', authMiddleware, userscontroller.refreshToken)

// 유저 조회 API
router.get('/detail/:userId', userscontroller.findUserByUserId)

// 유저 목록 조회 API
router.get('/list', userscontroller.findList)

// 유저 수정 API
router.patch('/edit', uploadUserImage, userscontroller.updateUserInfo)

// 회원 탈퇴 APi
router.delete('/withdraw', authMiddleware, userscontroller.deleteUsersSelf)

// 유저 마이페이지 API
router.get('/mypage', authMiddleware, userscontroller.getUserSelf)


export default router