import { emailVerificationMiddleware } from "../middlewares/emailVerification.middleware.js";
import { tokenKey } from "../redis/keys.js";
import { PETTYPE, Prisma } from "@prisma/client";

export class SittersRepository {
  constructor(prisma, redisClient) {
    this.prisma = prisma;
    this.redisClient = redisClient;
  }

  //이메일로 시터 모든 정보 불러옴
  findSitterByEmail = async (email) => {
    return await this.prisma.sitters.findFirst({
      where: { email: email },
    });
  };

  //시터 계정 만들기
  createSitter = async (
    email,
    hashedPassword,
    name,
    phone_Number,
    career,
    adrress_Sitter,
    ablepettype,
    intro,
    age,
    gender,
    imageUrl
  ) => {
    const token = Math.floor(Math.random() * 900000) + 100000;
    await this.prisma.sitters.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone_Number,
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

  //시터 상태 업데이트(이메일 인증시)
  updateSitterVerificationStatus = async (sitterId) => {
    await this.prisma.sitters.update({
      where: { sitterId: +sitterId },
      data: { sitter_status: "pass" },
    });
  };

  // 토큰 저장(for redis)
  saveToken = async (sitterId, refreshToken) => {
    return this.redisClient.hSet(tokenKey(sitterId), "token", refreshToken);
  };

  //리프레시 토큰 가져오기(for redis)
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

  //시터 목록조회(경력순 정렬)
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

  // 아이디로 시터찾기
  findSitterById = async (sitterId) => {
    return await this.prisma.sitters.findFirst({
      where: {
        sitterId: +sitterId,
      },
    });
  };

  // 한번에 많은 시터 찾기
  findManyBySitter = async () => {
    return await this.prisma.sitters.findMany();
  };

  // 아이디로 시터찾아서 특정 필드만
  getSitterBySitterId = async (sitterId) => {
    return await this.prisma.sitters.findFirst({
      where: { sitterId: +sitterId },
      select: {
        sitterId: true,
        email: true,
        name: true,
        phone_Number: true,
        career: true,
        adrress_Sitter: true,
        ablepettype: true,
        profile_Image: true,
        intro: true,
        age: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  };

  //시터 정보 수정
  updateSitterInfo = async (
    email,
    name,
    phone_Number,
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
        phone_Number,
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

  //시터 회원 탈퇴
  deleteSitterSelf = async (email) => {
    await this.prisma.sitters.delete({
      where: { email: email },
    });
    return;
  };

  // 아이디로 시터정보 다 불러오기
  findSitterById = async (sitterId) => {
    return await this.prisma.sitters.findFirst({
      where: {
        sitterId: +sitterId,
      },
    });
  };

  //시터정보 전체 다 불러오기
  findManyBySitter = async () => {
    return await this.prisma.sitters.findMany();
  };

  //ablePetType으로 필터해서 가져오는 시터목록
  getSittersBypetType = async (ablePetType) => {
    return await this.prisma.sitters.findMany({
      where: { ablePetType: ablePetType },
    });
  };

  //adrress_Sitters으로 필터해서 가져오는 시터목록
  getSittersByAddress = async (adrress_Sitters) => {
    return await this.prisma.sitters.findMany({
      where: { adrress_Sitters: adrress_Sitters },
    });
  };
}
