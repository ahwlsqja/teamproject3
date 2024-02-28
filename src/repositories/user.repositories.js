import { emailVerificationMiddleware } from "../middlewares/emailVerification.middleware.js";
import { tokenKey } from "../redis/keys.js";
import { Prisma } from "@prisma/client";

export class UsersRepository {
  constructor(prisma, redisClient) {
    this.prisma = prisma;
    this.redisClient = redisClient;
  }

  findUserByEmail = async (email) => {
    return await this.prisma.users.findFirst({
      where: { email: email },
    });
  };

  getUserById = async (userId) => {
    return await this.prisma.users.findMany({
      where: { userId: +userId },
      select: {
        userId: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        pets: {
          select: {
            name: true,
            petId: true,
            petType: true,
            age: true,
          },
        },
      },
    });
  };

  findUserByUserId = async (userId) => {
    return await this.prisma.users.findFirst({
      where: {
        userId: +userId,
      },
    });
  };

  createUser = async (
    email,
    hashedPassword,
    name,
    phone_Number,
    intro,
    age,
    gender,
    imageUrl
  ) => {
    const token = Math.floor(Math.random() * 900000) + 100000;
    const user = await this.prisma.users.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
        phone_Number: phone_Number,
        intro: intro,
        age: +age,
        gender: gender,
        user_status: "nonpass",
        emailTokens: token.toString(),
        profile_Image: imageUrl,
      },
    });

    await emailVerificationMiddleware(email, token);
    return user;
  };

  updateUserVerificationStatus = async (userId) => {
    await this.prisma.users.update({
      where: { userId: userId },
      data: { user_status: "pass" },
    });
  };

  saveToken = async (userId, refreshToken) => {
    return await this.redisClient.hSet(tokenKey(userId), "token", refreshToken);
  };

  getToken = async (userId) => {
    return await this.redisClient.hGet(tokenKey(userId), "token");
  };
}
