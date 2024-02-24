import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { redisClient } from "../redis/client.js";
import { UserRepository } from "../repositories/user.repositories.js";
import { UserService } from "../services/user.services.js";
import { UserController } from "../controllers/user.controller.js";

const router = express.Router();

const userRepository = new UserRepository(prisma, redisClient);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// 유저 상세 조회 API
router.get("/users", userController.findUserByEmail);

// 로그인한 유저 프로필 조회 API
router.get("/user/:userId", userController.getLoginedUser);
