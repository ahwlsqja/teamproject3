export class Userscontroller {
  constructor(usersService) {
    this.usersService = usersService;
  }

  // 회원가입
  signUp = async (req, res, next) => {
    try {
      const {
        email,
        password,
        confirmpassword,
        name,
        phone_Number,
        intro,
        age,
        gender,
      } = req.body;
      const imageUrl = req.file.Location;
      console.log(imageUrl);
      if (!email || !password || !confirmpassword || !name || !phone_Number) {
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
      const user = await this.usersService.signUp(
        email,
        password,
        name,
        phone_Number,
        intro,
        age,
        gender,
        imageUrl
      );

      return res.status(201).json({ data: user });
    } catch (err) {
      next(err);
    }
  };

  // 이메일 인증
  verifySignUp = async (req, res, next) => {
    try {
      const { email, verifiedusertoken } = req.body;
      await this.usersService.verifySignUp(email, verifiedusertoken);
      return res.status(200).json({ message: "인증에 성공했습니다." });
    } catch (err) {
      next(err);
    }
  };

  // 로그인
  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "입력칸을 채워주세요." });
      }
      const tokens = await this.usersService.signIn(email, password);
      res.cookie("accessToken", `Bearer ${tokens.accessToken}`);
      res.cookie("refreshToken", `Bearer ${tokens.refreshToken}`);
      return res
        .status(200)
        .json({ message: "로그인에 성공하였습니다.", token: tokens.token });
    } catch (err) {
      next(err);
    }
  };

  // 자동 로그인

  refreshToken = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;
      const tokens = await this.usersService.refreshToken(refreshToken);
      res.cookie("accessToken", `Bearer ${tokens.accessToken}`);
      res.cookie("refreshToken", `Bearer ${tokens.newRefreshToken}`);

      return res
        .status(200)
        .json({ message: "새로운 토큰 재발급에 성공했습니다." });
    } catch (err) {
      next(err);
    }
  };
}
