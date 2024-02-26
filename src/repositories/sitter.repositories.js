import { emailVerificationMiddleware } from "../middlewares/emailVerification.middleware.js";
import { tokenKey } from "../redis/keys.js";
import { Prisma } from "@prisma/client";

export class SittersRepository {
  constructor(prisma, redisClient) {
    this.prisma = prisma;
    this.redisClient = redisClient;
  }

  findSitterByEmail = async (email) => {
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
    adrress_Sitter,
    ablepettype,
    intro,
    age,
    gender
  ) => {
    const imageUrl = req.file.Location;
    const token = Math.floor(Math.random() * 900000) + 100000;
    await tx.sitters.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone_number,
        intro,
        age,
        gender,
        career,
        adrress_Sitter,
        ablepettype,
        sitter_Status: "nonpass",
        email_verified: token.toString(),
        profile_image: imageUrl,
      },
    });

    await emailVerificationMiddleware(email, token);
    return;
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
        adrress_Sitter: true,
        ablepettype: true,
        profile_image: true,
        intro: true,
      },
      orderBy: [{ [orderKey]: orderValue.toLowerCase() }],
    });
  };

  getSitterBySitterId = async (sitterId) => {
    //보여줄만한 정보만 가져옴
    return await this.prisma.sitters.findFirst({
      where: { sitterId: +sitterId },
      select: {
        sitterId: true,
        email: true,
        name: true,
        phone_number: true,
        career: true,
        adrress_Sitter: true,
        ablepettype: true,
        profile_image: true,
        intro: true,
        age: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  };

  updateSitterInfo = async (
    email,
    name,
    phone_number,
    career,
    intro,
    age,
    gender,
    adrress_Sitter,
    ablePetType
  ) => {
    await this.prisma.sitters.update({
      where: { email: email },
      data: {
        name,
        phone_number,
        career,
        intro,
        age,
        gender,
        adrress_Sitter,
        ablePetType,
      },
    });
    return;
  };

  deleteSitterSelf = async (email) => {
    await this.prisma.sitters.delete({
      where: { email: email },
    });
    return;
  };
}
