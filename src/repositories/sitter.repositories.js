import { emailVerificationMiddleware } from "../middlewares/emailVerification.middleware.js";
import { tokenKey } from "../redis/keys.js"
import { Prisma  } from "@prisma/client";


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
}