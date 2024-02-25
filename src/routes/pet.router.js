import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { redisClient } from "../redis/client.js";

import { PetController } from "../controllers/pet.controller.js";
import { PetService } from "../services/pet.services.js";
import { PetRepository } from "../repositories/pet.repositories.js";

const petRepository = new PetRepository(prisma);
const petService = new PetService(petRepository);
const petController = new PetController(petService);

const router = express.Router();

router.post("/pet", petController.createPet);

export default router;
