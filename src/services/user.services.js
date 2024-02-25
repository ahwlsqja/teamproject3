import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendTodayData } from "../middlewares/slackBot.js"
import "dotenv/config.js";
import { uploadUserImage } from "../middlewares/image.middleware.js"

export class UsersService {
    constructor(usersRepository){
        this.usersRepository = usersRepository;
    }

    // 회원가입
    signUp = async (email, password, name, phone_number, intro, age, gender) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const isExistUser = await this.usersRepository.findUserByEmail(email);
        if(isExistUser){
            throw new Error('이미 있는 이메일입니다.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.usersRepository.createUser(email, hashedPassword, name, phone_number, intro, age, gender);
        try{
            await sendTodayData();
        } catch(err) {
            next(err);
        }

        
        return user;
    }


    // 회원가입 이메일 인증
    verifySignUp = async ( email, verifiedusertoken ) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const user = await this.usersRepository.findUserByEmail(email);
        if(!user.email_verified){
            throw new Error("인증번호가 없습니다.");
        }

        if(verifiedusertoken !== user.email_verified){
            throw new Error("실패했습니다.");
        }
        await this.usersRepository.updateUserVerificationStatus(user.userId);
        try{
            await sendTodayData();
        }catch(err){
            next(err)
        }
    }

    // 로그인 
    signIn = async (email, password) => {
        const user = await this.usersRepository.findUserByEmail(email);

        // 해당 이메일을 가진 유저가 있는지 유효성 검사
        if(!user){
            throw new Error('존재하지 않는 이메일입니다.');
        }
        
        // user의 패스워드는 해시 처리 되있기 때문에 compare로 해야함.
        if(!(await bcrypt.compare(password, user.password))){
            throw new Error('비밀번호가 일치하지 않습니다.')
        }
        // token만들어줌 
        const token = jwt.sign({ userId: user.userId },process.env.JWT_SECRET, { expiresIn: '12h'});
        const refreshToken = jwt.sign({ userId: user.userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        await this.usersRepository.saveToken(user.userId, refreshToken);

        return { token, refreshToken };

    }

    // 리프레쉬 코튼으로 갱신
    refreshToken = async (refreshToken) => {
        if(!refreshToken){
            throw new Error('리프레쉬 토큰이 없습니다.');
        }
        try{
            // userId 뱉음 jwt.verify가
            const { userId } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const savedRefreshToken = await this.usersRepository.getToken(userId);
            if(refreshToken !== savedRefreshToken){
                throw new Error("리프레쉬 토큰이 유효하지 않습니다.")
            };
            
            const newToken = jwt.sign({ userId : userId }, process.env.JWT_SECRET, { expiresIn: '12h'});
            const newRefreshToken = jwt.sign({ userId: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d'})
            await this.usersRepository.saveToken(userId, newRefreshToken);

            return { newToken, newRefreshToken };
        } catch(err) {
            throw new Error('리프레시 토큰이 유효하지 않습니다.');
        }
    }

    // 유저 상세 조회
    findUserByEmail = async (email) => {
        const user = await this.usersRepository.findUserByEmail(email);
  
    return {
      userId: user.userId,
      email: user.email,
      name: user.name,
      age: user.age,
      gender: user.gender,
      intro: user.intro,
      pets: {
        select: {
          petId: true,
          name: true,
          pettype: true,
        },
      },
    };
  };
}


