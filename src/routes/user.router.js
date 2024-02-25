import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { redisClient } from '../redis/client.js';
import { UsersRepository } from '../repositories/user.repositories.js';
import { UsersService } from '../services/user.services.js';
import { Userscontroller } from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js'



const router = express.Router();

const usersRepository = new UsersRepository(prisma, redisClient);
const usersService = new UsersService(usersRepository);
const userscontroller = new Userscontroller(usersService);



router.get('/user_info', authMiddleware ,userscontroller.getUser)