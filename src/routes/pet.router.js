import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { redisClient } from "../redis/client.js";
import { uploadPetImage } from "../middlewares/image.middleware.js";
import { PetController } from "../controllers/pet.controller.js";
import { PetService } from "../services/pet.services.js";
import { PetRepository } from "../repositories/pet.repositories.js";
import { UsersRepository } from "../repositories/user.repositories.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const usersRepository = new UsersRepository(prisma, redisClient);
const petRepository = new PetRepository(prisma);
const petService = new PetService(petRepository, usersRepository);
const petController = new PetController(petService);

const router = express.Router();

// 펫 생성 API
router.post("/", authMiddleware, uploadPetImage, petController.createPet);

// 펫 1마리 조회하기 API(유저입장)
router.get("/:petId", authMiddleware, petController.findOnePet);

// 유저의 모든펫 조회하기 (제 3자 입장에서)
router.get("/user/:userId", petController.findUserPets);

// 펫 정보 수정하기 (유저 입장)
router.put(
  "/:petId",
  authMiddleware,
  uploadPetImage,
  petController.updatePetInfo
);

// 펫 정보 삭제하기 (유저 입장)
router.delete("/:petId", authMiddleware, petController.deletePetInfo);

// 종류별 펫 찾기 (제 3자 입장)
router.get("/", petController.findPetsByPetType);

export default router;
