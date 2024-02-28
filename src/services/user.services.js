import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

export class UsersService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  // 회원가입
  signUp = async (
    email,
    password,
    name,
    phone_Number,
    intro,
    age,
    gender,
    imageUrl
  ) => {
    const isExistUser = await this.usersRepository.findUserByEmail(email);
    if (isExistUser) {
      throw new Error("이미 있는 이메일입니다.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersRepository.createUser(
      email,
      hashedPassword,
      name,
      phone_Number,
      intro,
      age,
      gender,
      imageUrl
    );

    return user;
  };

  // 회원가입 이메일 인증
  verifySignUp = async (email, verifiedusertoken) => {
    const user = await this.usersRepository.findUserByEmail(email);
    if (!user.emailTokens) {
      throw new Error("인증번호가 없습니다.");
    }

    if (verifiedusertoken !== user.emailTokens) {
      throw new Error("실패했습니다.");
    }
    return await this.usersRepository.updateUserVerificationStatus(user.userId);
  };

  // 로그인
  signIn = async (email, password) => {
    const user = await this.usersRepository.findUserByEmail(email);

    // 해당 이메일을 가진 유저가 있는지 유효성 검사
    if (!user) {
      throw new Error("존재하지 않는 이메일입니다.");
    }

    // user의 패스워드는 해시 처리 되있기 때문에 compare로 해야함.
    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }
    // token만들어줌
    const accessToken = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );
    console.log(accessToken);
    const refreshToken = jwt.sign(
      { userId: user.userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    await this.usersRepository.saveToken(user.userId, refreshToken);

    return { accessToken, refreshToken };
  };

  // 리프레쉬 코튼으로 갱신
  refreshToken = async (refreshToken) => {
    if (!refreshToken) {
      throw new Error("리프레쉬 토큰이 없습니다.");
    }
    try {
      // userId 뱉음 jwt.verify가
      const [tokenType, token] = refreshToken.split(" ");
      const { userId } = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const savedRefreshToken = await this.usersRepository.getToken(userId);
      if (token !== savedRefreshToken) {
        throw new Error("리프레쉬 토큰이 유효하지 않습니다.");
      }

      const accessToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
        expiresIn: "12h",
      });
      const newRefreshToken = jwt.sign(
        { userId: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );
      await this.usersRepository.saveToken(userId, newRefreshToken);

      return { accessToken, newRefreshToken };
    } catch (err) {
      throw new Error("리프레시 토큰이 유효하지 않습니다.");
    }

    // 유저 상세 조회
    findUserByEmail = async (email) => {
      const user = await this.usersRepository.findUserByEmail(email);
      if (!user) {
        throw new Error("해당하는 이메일이 없습니다.");
      }
      return await this.usersRepository.getUserByemailPet(email);
    };

    // 유저 목록 조회
    findList = async () => {
      const findList = await this.usersRepository.findList();
      for (const info of findList) {
        delete info.password,
          delete info.user_status,
          delete info.email,
          delete info.userId;
      }

      return findList;
    };

    // 유저 정보 수정
    updateUserInfo = async (
      email,
      password,
      name,
      phone_Number,
      intro,
      age,
      gender,
      imageUrl
    ) => {
      const user = await this.usersRepository.findUserByEmail(email);
      if (!user) {
        throw new Error("해당하는 유저가 없습니다.");
      }

      if (!(await bcrypt.compare(password, user.password))) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      }

      return await this.usersRepository.updateUserInfo(
        email,
        name,
        phone_Number,
        intro,
        age,
        gender,
        imageUrl
      );
    };
  };
}
