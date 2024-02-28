import { emailVerificationMiddleware } from "../middlewares/emailVerification.middleware.js";
import { tokenKey } from "../redis/keys.js";
import { Prisma } from "@prisma/client";

export class SittersRepository {
  constructor(prisma, redisClient) {
    this.prisma = prisma;
    this.redisClient = redisClient;
  }

  // 시터 계정 생성
  createSitter = async (
    email,
    hashedPassword,
    name,
    phone_Number,
    career,
    address_Sitters,
    ablePetType,
    intro,
    age,
    gender,
    imageUrl
  ) => {
    const token = Math.floor(Math.random() * 900000) + 100000;
    const sitter = await this.prisma.sitters.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
        phone_Number: phone_Number,
        intro: intro,
        age: +age,
        gender,
        career: +career,
        address_Sitters,
        ablePetType,
        sitter_Status: "nonpass",
        emailTokens: token.toString(),
        profile_Image: imageUrl,
      },
    });
    await emailVerificationMiddleware(email, token);
    return sitter;
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
    return await this.redisClient.hSet(
      tokenKey(sitterId),
      "token",
      refreshToken
    );
  };

  //리프레시 토큰 가져오기(for redis)
  getToken = async (sitterId) => {
    return await this.redisClient.hGet(tokenKey(sitterId), "token");
  };

  // 이메일로 시터찾기
  findSitterByEmail = async (email) => {
    return await this.prisma.sitters.findFirst({
      where: { email: email },
    });
  };

  // 한번에 많은 시터 찾기
  findManySitter = async () => {
    return await this.prisma.sitters.findMany();
  };

  // 펫 종류로 시터 목록 조회
  getSitterBypetType = async (ablePetType) => {
    return await this.prisma.sitters.findMany({
      where: { ablePetType: ablePetType },
    });
  };

  // 시터 주소로 시터 목록 조회
  getSittersByAddress = async (address_Sitters) => {
    return await this.prisma.sitters.findMany({
      where: { address_Sitters: address_Sitters },
    });
  };

  //시터 목록 조회(경력순)
  getSitterList = async (orderKey, orderValue) => {
    return await this.prisma.sitters.findMany({
      select: {
        sitterId: true,
        name: true,
        career: true,
        address_Sitters: true,
        ablePetType: true,
        profile_Image: true,
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

  //시터 정보 수정
  updateSitterInfo = async (
    email,
    name,
    phone_Number,
    career,
    intro,
    age,
    gender,
    address_Sitters,
    ablePetType,
    imageUrl
  ) => {
    return await this.prisma.sitters.update({
      where: { email: email },
      data: {
        name,
        phone_Number,
        career,
        intro,
        age: +age,
        gender,
        address_Sitters,
        ablePetType,
        profile_Image: imageUrl,
      },
    });
  };

  //시터 회원 탈퇴
  deleteSitterSelf = async (email) => {
    return await this.prisma.sitters.delete({
      where: { email: email },
    });
  };
}
