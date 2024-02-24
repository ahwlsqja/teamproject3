import { emailVerificationMiddleware } from "../middlewares/emailVerification.middleware.js";
import { toKenKey } from "../redis/keys.js"
import { Prisma  } from "@prisma/client";

export class UsersRepository {
    constructor(prisma, redisClient){
        this.prisma = prisma;
        this.redisClient = redisClient;
    }

    findUserByEmail = async (email) => {
        return await this.prisma.users.findFirst({
            where: { email: email }
        });
    }

    createUser = async (email, hashedPassword, name, phone_number, intro, age, profile_image, gender) => {
        const token = Math.floor(Math.random() * 900000) + 100000;
        const user = await this.prisma.$transaction(async(tx) => {
            const user = await tx.users.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    phone_number,
                    intro,
                    age,
                    gender,
                    user_status: "nonpass",
                    emailTokens: token.toString(),
                }
            });

            await emailVerificationMiddleware(email, token);
            return user
        },{
            isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted
        });  
        
        


    updateUserVerificationStatus = async (userId) => {
        await this.prisma.users.update({
            where: { userId: userId },
            data: { user_status: "pass" },
        });
    }

    







    }















}