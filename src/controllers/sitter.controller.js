export class SittersController {
  constructor(sittersService) {
    this.sittersService = sittersService;
  }

  //시터 회원가입
  signUp = async (req, res, next) => {
    try {
      const {
        email,
        password,
        confirmpassword,
        name,
        phone_number,
        career,
        local,
        ablepettype,
        profile_image,
        intro,
        age,
        gender,
      } = req.body;

      if (
        !email ||
        !password ||
        !confirmpassword ||
        !name ||
        !phone_number ||
        !career ||
        !local ||
        !ablepettype
      ) {
        return res
          .status(400)
          .json({ message: "필수 입력칸을 모두 채워주세요" });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "비밀번호는 최소 6자 이상입니다." });
      }

      if (password !== confirmpassword) {
        return res
          .status(400)
          .json({ message: "비밀번호가 일치하지 않습니다." });
      }

      if (!["dog", "cat"].includes(ablepettype)) {
        return res.status(400).json({
          message: "펫 종류 입력이 올바르지 않습니다.",
        });
      }

      const sitter = await this.sittersService.signUp(
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
      );

      return res.status(201).json({
        message: `시터 회원가입이 완료되었습니다. 환영합니다 ${sitter.name}님!`,
      });
    } catch (err) {
      next(err);
    }
  };

  // 시터 이메일 인증
  verifySignUp = async (email, verifiedsittertoken) => {
    try {
      const { email, verifiedsittertoken } = req.body;
      await this.sittersService.verifySignUp(email, verifiedsittertoken);
      return res.status(200).json({ message: "인증에 성공했습니다." });
    } catch (err) {
      next(err);
    }
  };

  // 시터 로그인
  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "입력칸을 채워주세요." });
      }
      const tokens = await this.sittersService.signIn(email, password);
      res.cookie("accessToken", `Bearer ${tokens.accessToken}`);
      res.cookie("refreshToken", `Bearer ${tokens.refreshToken}`);
      return res.status(200).json({
        message: "로그인에 성공하였습니다.",
        token: tokens.accessToken,
      });
    } catch (err) {
      next(err);
    }
  };

  // 자동 로그인
  refreshToken = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;
      const tokens = await this.sittersService.refreshToken(refreshToken);
      res.cookie("accessToken", `Bearer ${tokens.newToken}`);
      res.cookie("refreshToken", `Bearer ${tokens.newRefreshToken}`);

      return res
        .status(200)
        .json({ message: "새로운 토큰 재발급에 성공했습니다." });
    } catch (err) {
      next(err);
    }
  };
  //시터 목록 조회(필터링/정렬)//필터링 구현안됨. 인기순정렬 손봐야 함.
  getSitterList = async (req, res, next) => {
    try {
      const orderKey = req.query.orderKey ?? "star";
      const orderValue = req.query.orderValue ?? "desc";

      if (!["star", "career"].includes(orderKey)) {
        return res.status(400).json({
          message: "orderkey가 올바르지 않습니다.",
        });
      }

      if (!["asc", "desc"].includes(orderValue.toLowerCase())) {
        return res.status(400).json({
          message: "orderValue가 올바르지 않습니다.",
        });
      }

      const sitters = await this.sittersService.getSitterList(
        orderKey,
        orderValue
      );

      return res.status(200).json({ data: sitters });
    } catch (err) {
      next(err);
    }
  };

  //시터 마이페이지
  getSitterSelf = async (req, res, next) => {
    try {
      const { sitterId } = req.sitter;

      const sitter = await this.sittersService.getSitterBySitterId(sitterId);
      return res.ststus(200).json({ data: sitter });
    } catch (err) {
      next(err);
    }
  };
  //시터 상세조회
  getSitterBySitterId = async (req, res, next) => {
    try {
      const { sitterId } = req.params;

      const sitter = await this.sittersService.getSitterBySitterId(sitterId);
      return res.ststus(200).json({ data: sitter });
    } catch (err) {
      next(err);
    }
  };
}
