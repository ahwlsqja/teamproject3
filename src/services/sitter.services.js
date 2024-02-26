import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendTodayData } from "../middlewares/slackBot.js";
import "dotenv/config.js";
import { uploadUserImage } from "../middlewares/image.middleware.js";

export class SittersService {
  constructor(sittersRepository) {
    this.sittersRepository = sittersRepository;
  }

  //회원가입
  signUp = async (
    email,
    password,
    name,
    phone_number,
    career,
    local,
    ablepettype,
    profile_image,
    intro,
    age,
    gender
  ) => {
    const isExistSitter = await this.sittersRepository.findsitterByEmail(email);
    if (!isExistSitter) {
      throw new Error("이미 시터로 가입한 이메일입니다.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sitter = await this.sittersRepository.createSitter(
      email,
      hashedPassword,
      name,
      phone_number,
      career,
      local,
      ablepettype,
      profile_image,
      intro,
      age,
      gender
    );

    try {
      await sendTodayData();
    } catch (err) {
      next(err);
    } // 이거 뭐지요...? 왜있죠...?

    return sitter;
  };

  // 회원가입 이메일 인증
  verifySignUp = async (email, verifiedusertoken) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const sitter = await this.sittersRepository.findSitterByEmail(email);
    if (!sitter.email_verified) {
      throw new Error("인증번호가 없습니다.");
    }

    if (verifiedusertoken !== sitter.email_verified) {
      throw new Error("실패했습니다.");
    }
    await this.sittersRepository.updateSitterVerificationStatus(
      sitter.sitterId
    );
    try {
      await sendTodayData();
    } catch (err) {
      next(err);
    }
  };

  //시터 로그인
  signIn = async (email, password) => {
    const sitter = await this.sittersRepository.findSitterByEmail(email);

    // 해당 이메일을 가진 유저가 있는지 유효성 검사
    if (!sitter) {
      throw new Error("존재하지 않는 이메일입니다.");
    }

    // user의 패스워드는 해시 처리 되있기 때문에 compare로 해야함.
    if (!(await bcrypt.compare(password, sitter.password))) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }
    // token만들어줌
    const accessToken = jwt.sign(
      { sitterId: sitter.sitterId },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );
    const refreshToken = jwt.sign(
      { sitterId: sitter.sitterId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    await this.sittersRepository.saveToken(sitter.sitterId, refreshToken);

    return { accessToken, refreshToken };
  };

  //리프레쉬 토큰으로 갱신
  refreshToken = async (refreshToken) => {
    if (!refreshToken) {
      throw new Error("리프레쉬 토큰이 없습니다.");
    }
    try {
      const { sitterId } = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );
      const savedRefreshToken = await this.sittersRepository.getToken(sitterId);
      if (refreshToken !== savedRefreshToken) {
        throw new Error("리프레쉬 토큰이 유효하지 않습니다.");
      }

      const newToken = jwt.sign(
        { sitterId: sitterId },
        process.env.JWT_SECRET,
        {
          expiresIn: "12h",
        }
      );
      const newRefreshToken = jwt.sign(
        { sitterId: sitterId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );
      await this.sittersRepository.saveToken(sitterId, newRefreshToken);

      return { newToken, newRefreshToken };
    } catch (err) {
      throw new Error("리프레시 토큰이 유효하지 않습니다.");
    }
  };

  //   findSitterByEmail = async (email) => {
  //     const sitter = await this.sittersRepository.findSitterByEmail(email);

  //     return {
  //       sitterId: sitter.sitterId,
  //       email: sitter.email,
  //       name: sitter.name,
  //       age: sitter.age,
  //       gender: sitter.gender,
  //       intro: sitter.intro,
  //       career: sitter.career,
  //       local: sitter.local,
  //       ablepettype: sitter.ablepettype,
  //       profile_image: sitter.profile_image,
  //       reviews: {select: {star의 평균}}
  //     };
  //   };이거 있어야되나..? 여기선 어차피 repository에 있는거 쓰고.. sitterController에서 안써서 필요없는데..

  getSitterList = async (orderKey, orderValue) => {
    const sitters = await this.sittersRepository.getSitterList(
      orderKey,
      orderValue
    );
    return sitters;
  };

  getSitterBySitterId = async (sitterId) => {
    const sitter = await this.sittersRepository.getSitterBySitterId(sitterId);

    if (!sitter) {
      throw new Error("시터를 찾지 못했습니다");
    }

    return sitter;
  };
}
