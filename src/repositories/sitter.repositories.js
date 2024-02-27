import { emailVerificationMiddleware } from "../middlewares/emailVerification.middleware.js";
import { tokenKey } from "../redis/keys.js"
import { PETTYPE, Prisma  } from "@prisma/client";


export class SittersRepository {
    constructor(prisma, redisClient) {
      this.prisma = prisma;
      this.redisClient = redisClient;
    }

// 이메일로 시터찾기
findSitterByEmail = async (email) => {
    return await this.prisma.sitters.findFirst({
         where: { email: email },
    });
};

// 아이디로 시터찾기
findSitterById = async(sitterId) => {
    return await this.prisma.sitters.findFirst({
    where: {
        sitterId: +sitterId
    }
  })
}

// 한번에 많은 시터 찾기
findManyBySitter = async() => {
    return await this.prisma.sitters.findMany()
 }


 // 아이디로 시터찾아서 특정 필드만 가져오기
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
      },
    });
  };


  // 펫 종류로 시터 찾기
  getSittersBypetType = async (ablePetType) => {
    return await this.prisma.sitters.findMany({
        where: { ablePetType: ablePetType }
    })
  }


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
    gender, imageUrl) => {
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
    })
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



  // 시터 주소로 시터 찾기
  getSittersByAddress = async (adrress_Sitters) => {
    return await this.prisma.sitters.findMany({
        where: { adrress_Sitters : adrress_Sitters}
    })
  }


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
}


