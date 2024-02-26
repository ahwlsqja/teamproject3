import { emailVerificationMiddleware } from "../middlewares/emailVerification.middleware.js";
import { tokenKey } from "../redis/keys.js"
import { PETTYPE, Prisma  } from "@prisma/client";


export class SittersRepository {
    constructor(prisma, redisClient){
        this.prisma = prisma;
        this.redisClient = redisClient;
    }





    // 아이디로 시터찾기
  findSitterById = async(sitterId) => {
    return await this.prisma.sitters.findFirst({
        where: {
            sitterId: +sitterId
        }
  })
}

 findManyBySitter = async() => {
    return await this.prisma.sitters.findMany()
 }

 //
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

  getSittersBypetType = async (ablePetType) => {
    return await this.prisma.sitters.findMany({
        where: { ablePetType: ablePetType }
    })
  }

  getSittersByAddress = async (adrress_Sitters) => {
    return await this.prisma.sitters.findMany({
        where: { adrress_Sitters : adrress_Sitters}
    })
  }
}