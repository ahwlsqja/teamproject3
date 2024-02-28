import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

export class SittersService {
  constructor(sittersRepository, reviewsRepository) {
    this.sittersRepository = sittersRepository;
    this.reviewsRepository = reviewsRepository;
  }

  //시터 회원가입
  signUp = async (
    email,
    password,
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
    const isExistSitter = await this.sittersRepository.findSitterByEmail(email);
    if (isExistSitter) {
      throw new Error("이미 시터로 가입한 이메일입니다.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sitter = await this.sittersRepository.createSitter(
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
    );

    return sitter;
  };

  // 회원가입 이메일 인증
  verifySignUp = async (email, verifiedusertoken) => {
    const sitter = await this.sittersRepository.findSitterByEmail(email);
    if (!sitter.email_verified) {
      throw new Error("인증번호가 없습니다.");
    }

    if (verifiedusertoken !== sitter.emailTokens) {
      throw new Error("실패했습니다.");
    }
    await this.sittersRepository.updateSitterVerificationStatus(
      sitter.sitterId
    );
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
      const [tokenType, token] = refreshToken.split(" ");
      const { sitterId } = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const savedRefreshToken = await this.sittersRepository.getToken(sitterId);

      if (token !== savedRefreshToken) {
        throw new Error("리프레쉬 토큰이 유효하지 않습니다.");
      }

      const accessToken = jwt.sign(
        { sitterId: +sitterId },
        process.env.JWT_SECRET,
        {
          expiresIn: "12h",
        }
      );
      const newRefreshToken = jwt.sign(
        { sitterId: +sitterId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );
      await this.sittersRepository.saveToken(sitterId, newRefreshToken);

      return { accessToken, newRefreshToken };
    } catch (err) {
      throw new Error("리프레시 토큰이 유효하지 않습니다.");
    }
  };

  //시터목록조회(정렬)
  getSitterList = async (orderKey, orderValue) => {
    const sitters = await this.sittersRepository.getSitterList(
      orderKey,
      orderValue
    );
    return sitters;
  };

  // 특정 시터의 상세 조회
  getSitterBySitterId = async (sitterId) => {
    const findSittersavgstar = await this.reviewsRepository.findSittersavgstar(
      sitterId
    );

    const sitter = await this.sittersRepository.findSitterById(sitterId);
    if (!sitter) {
      throw new Error("시터를 찾지 못했습니다");
    }

    sitter.avg_rating = findSittersavgstar[0]
      ? findSittersavgstar[0]._avg.star
      : 0;

    return {
      sitterId: sitter.sitterId,
      email: sitter.email,
      name: sitter.name,
      phone_Number: sitter.phone_Number,
      career: sitter.career,
      address_Sitters: sitter.address_Sitters,
      ablePetType: sitter.ablePetType,
      profile_Image: sitter.profile_Image,
      intro: sitter.intro,
      age: sitter.age,
      gender: sitter.gender,
      createdAt: sitter.createdAt,
      updatedAt: sitter.updatedAt,
      avg_rating: sitter.avg_rating,
    };
  };

  //시터 정보 수정
  updateSitterInfo = async (
    email,
    password,
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
    const sitter = await this.sittersRepository.findSitterByEmail(email);
    const checkPassword = await bcrypt.compare(password, sitter.password);

    if (!checkPassword) {
      throw new Error("비밀번호가 다릅니다.");
    }

    return await this.sittersRepository.updateSitterInfo(
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
    );
  };

  //시터 회원 탈퇴
  deleteSitterSelf = async (password, email) => {
    const sitter = await this.sittersRepository.findSitterByEmail(email);
    const checkPassword = await bcrypt.compare(password, sitter.password);

    if (!checkPassword) {
      throw new Error("비밀번호가 다릅니다.");
    }

    await this.sittersRepository.deleteSitterSelf(email);

    return;
  };

  // 시터 평점순 목록 내림차순
  findManySitterId = async () => {
    const sitterInfo = await this.sittersRepository.findManyBySitter();
    const rankSitter = await this.reviewsRepository.findManySitterDesc();
    for (const rank of rankSitter) {
      for (const sitter of sitterInfo) {
        if (rank.sitterId === sitter.sitterId) {
          rank.sitterName = sitter.name;
          rank.sitterEmail = sitter.email;
        }
      }
    }
    return rankSitter;
  };

  //ablePetType으로 필터해서 가져오는 시터목록
  getSitterBypetType = async (ablePetType) => {
    const findList = await this.sittersRepository.getSitterBypetType(
      ablePetType
    );
    return findList.map((sitter) => ({
      sitterId: sitter.sitterId,
      name: sitter.name,
      profile_Image: sitter.profile_Image,
      career: sitter.career,
      address_Sitters: sitter.address_Sitters,
      ablePetType: sitter.ablePetType,
    }));
  };

  //adrress_Sitters으로 필터해서 가져오는 시터목록
  getSittersByAddress = async (adrress_Sitters) => {
    const findList = await this.sittersRepository.getSittersByAddress(
      adrress_Sitters
    );
    return findList.map((sitter) => ({
      sitterId: sitter.sitterId,
      name: sitter.name,
      profile_Image: sitter.profile_Image,
      career: sitter.career,
      address_Sitters: sitter.address_Sitters,
      ablePetType: sitter.ablePetType,
    }));
  };
}
