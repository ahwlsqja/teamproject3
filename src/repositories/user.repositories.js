import { emailVerificationMiddleware } from "../middlewares/emailVerification.middleware.js";
import { tokenKey } from "../redis/keys.js"
import { Prisma  } from "@prisma/client";

export class UsersRepository {
    constructor(prisma, redisClient){
        this.prisma = prisma;
        this.redisClient = redisClient;
    }

    // email로 유저 찾기
    findUserByEmail = async (email) => {
        return await this.prisma.users.findFirst({
            where: { email: email }
        });
    }

    // email로 유저 찾기(펫까지 찾아줌)
    getUserByemailPet = async (email) => {
        return await this.prisma.users.findMany({
            where: { email: email },
            select: {
                userId: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                pets : {
                    select : {
                        namePet: true,
                        petId: true,
                        petType: true,
                        age: true,
                    }
                }
            }
        })
    }

    // Id로 유저 찾기(펫까지 찾아줌)
    getUserById = async (userId) => {
        return await this.prisma.users.findMany({
            where: { userId: +userId },
            select: {
                userId: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                pets : {
                    select : {
                        namePet: true,
                        petId: true,
                        petType: true,
                        age: true,
                    }
                }
            }
        })
    }

    // 유저 아이디로 유저 찾기
    findUserByUserId = async(userId) => {
        return await this.prisma.users.findFirst({
            where: {
                userId : +userId
            }
        })
    }

    // 유저 목록 조회
    findList = async() =>{
        return await this.prisma.users.findMany(
            )
    }

    // 유저 생성하기
    createUser = async (email, hashedPassword, name, phone_Number, intro, age, gender, imageUrl) => {
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
                }
            });

            await emailVerificationMiddleware(email, token);
            return user 
    };  
        
        

    // 유저 이메일 인증 
    updateUserVerificationStatus = async (userId) => {
        await this.prisma.users.update({
            where: { userId: userId },
            data: { user_status: "pass" },
        });
    }

    saveToken = async (userId, refreshToken) => {
        return await this.redisClient.hSet(tokenKey(userId), "token", refreshToken);
    };


    getToken = async (userId) => {
        return await this.redisClient.hGet(tokenKey(userId), 'token')
    }


    // 유저 수정 
    updateUserInfo = async (email, name, phone_Number,intro, age, gender, imageUrl
      ) => {
        return await this.prisma.users.update({
          where: { email: email },
          data: {
            name,
            phone_Number,
            intro,
            age: +age,
            gender,
            profile_Image: imageUrl,
          },
        });
      };
    
}
