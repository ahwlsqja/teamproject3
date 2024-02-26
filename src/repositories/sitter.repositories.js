import { emailVerificationMiddleware } from "../middlewares/emailVerification.middleware.js";
import { tokenKey } from "../redis/keys.js";
import { Prisma } from "@prisma/client";

export class SittersRepository {
  constructor(prisma, redisClient) {
    this.prisma = prisma;
    this.redisClient = redisClient;
  }

  findsitterByEmail = async (email) => {
    return await this.prisma.sitters.findFirst({
      where: { email: email },
    });
  };

  createSitter = async (
    email,
    hashedPassword,
    name,
    phone_number,
    career,
    local,
    ablepettype,
    profile_image, //프로필이미지 req.body로 안받나요...
    intro,
    age,
    gender
  ) => {
    const imageUrl = req.file.Location;
    const token = Math.floor(Math.random() * 900000) + 100000;
    const [sitter] = await this.prisma.$transaction(
      async (tx) => {
        const sitter = await tx.sitters.create({
          data: {
            email,
            password: hashedPassword,
            name,
            phone_number,
            intro,
            age,
            gender,
            career,
            local,
            ablepettype,
            sitter_Status: "nonpass",
            email_verified: token.toString(),
            profile_image: imageUrl,
          },
        });

        await emailVerificationMiddleware(email, token);
        return [sitter];
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      }
    );
  };

  updateSitterVerificationStatus = async (sitterId) => {
    await this.prisma.sitters.update({
      where: { sitterId: +sitterId },
      data: { sitter_status: "pass" },
    });
  };

  saveToken = async (sitterId, refreshToken) => {
    return this.redisClient.hSet(tokenKey(sitterId), "token", refreshToken);
  };

  getToken = async (sitterrId) => {
    return new Promise((resolve, reject) => {
      this.redisClient.hGet(tokenKey(sitterrId), "token", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };

  getSitterList = async (orderKey, orderValue) => {
    return await this.prisma.sitters.findMany({
      select: {
        sitterId: true,
        name: true,
        career: true,
        local: true,
        ablepettype: true,
        profile_image: true,
        intro: true,
        reviews: {
          select: { star: true }, //(의 평균...)
        },
      },
      orderBy: [{ [orderKey]: orderValue.toLowerCase() }],
    });
  };

  getSitterBySitterId = async (sitterId) => {
    return await this.prisma.sitters.findFirst({
      where: { sitterId: +sitterId },
      select: {
        sitterId: true,
        email: true,
        name: true,
        phone_number: true,
        career: true,
        local: true,
        ablepettype: true,
        profile_image: true,
        intro: true,
        age: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
        reviews: {
          select: { star: true }, //(의 평균...)
        },
      },
    });
  };
}
