export class SittersController {
    constructor(sittersService){
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
        phone_Number,
        career,
        address_Sitters,
        ablePetType,
        intro,
        age,
        gender,
      } = req.body;

      const imageUrl = req.file.Location;
      if (
        !email ||
        !password ||
        !name ||
        !phone_Number ||
        !career ||
        !address_Sitters ||
        !ablePetType
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

      //성별 값이 있는데 enum문자열이 아니면 에러
      if (!["MALE", "FEMALE"].includes(gender.toUpperCase())) {
        return res.status(400).json({ message: "성별을 바르게 입력해주세요." });
      }

      //ablePetType값이 enum문자열이 아니면 에러
      if (!["dog", "cat", "others"].includes(ablePetType.toLowerCase())) {
        return res.status(400).json({
          message: "펫 종류 입력이 올바르지 않습니다.",
        });
      }

      //adrress_Sitter값이 enum문자열이 아니면 에러
      if (
        ![
          "seoul",
          "gyeonggi",
          "gangwon",
          "chungbuk",
          "chungnam",
          "jeonbuk",
          "jeonnam",
          "gyeongbuk",
          "gyeongnam",
          "jeju",
        ].includes(address_Sitters.toLowerCase())
      ) {
        return res
          .status(400)
          .json({ message: "거주지역 입력이 올바르지 않습니다" });
      }

      const sitter = await this.sittersService.signUp(
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
      );

      return res.status(201).json({
        message: `시터 회원가입이 완료되었습니다. 환영합니다 ${sitter.name}님!`,
      });
    } catch (err) {
      next(err);
    }
  };

    // 시터 이메일 인증
    verifySignUp = async (req, res, next) => {
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

  //로그아웃
  signOut = async (req, res, next) => {
    try {
      res.clearCookies("accessToken");
      res.clearCookies("refreshToken");

      return res.status(200).json({ message: "로그아웃 되었습니다." });
    } catch (err) {
      next(err);
    }
  };

 //시터 목록 조회(경력순정렬)
 getSitterList = async (req, res, next) => {
    try {
      const orderKey = req.query.orderKey ?? "career";
      const orderValue = req.query.orderValue ?? "desc";

      if (!["career"].includes(orderKey)) {
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

  //타인이 시터 상세조회
  getSitterBySitterId = async (req, res, next) => {
    try {
      const { sitterId } = req.params;

      const sitter = await this.sittersService.getSitterBySitterId(sitterId);
      return res.ststus(200).json({ data: sitter });
    } catch (err) {
      next(err);
    }
  };

//시터 정보 수정
updateSitterInfo = async (req, res, next) => {
    try {
      const {
        password,
        name,
        phone_Number,
        career,
        intro,
        age,
        gender,
        address_Sitters,
        ablePetType,
      } = req.body;
      const { email } = req.sitter; //이메일주소로 받아야함

      //시터정보를 수정하려면 password를 필수적으로 입력해서 본인을 확인해야함.
      if (!password) {
        return res
          .status(400)
          .json({ message: "정보를 수정하시려면 비밀번호를 입력해주세요." });
      }

      //성별 값이 있는데 enum문자열이 아니면 에러
      if (gender && !["MALE", "FEMALE"].includes(gender.toLowerCase())) {
        return res.status(400).json({ message: "성별을 바르게 입력해주세요." });
      }

      //adrress_Sitter값이 있는데 enum문자열이 아니면 에러
      if (
        address_Sitters &&
        ![
          "seoul",
          "gyeonggi",
          "gangwon",
          "chungbuk",
          "chungnam",
          "jeonbuk",
          "jeonnam",
          "gyeongbuk",
          "gyeongnam",
          "jeju",
        ].includes(address_Sitters.toLowerCase())
      ) {
        return res
          .status(400)
          .json({ message: "거주지역 입력이 올바르지 않습니다" });
      }

      //ablePetType값이 있는데 enum문자열이 아니면 에러
      if (
        ablePetType &&
        !["dog", "cat", "others"].includes(ablePetType.toLowerCase())
      ) {
        return res.status(400).json({
          message: "펫 종류 입력이 올바르지 않습니다.",
        });
      }

      await this.sittersService.updateSitterInfo(
        email,
        password,
        name,
        phone_Number,
        career,
        intro,
        age,
        gender,
        address_Sitters,
        ablePetType
      );

      return res
        .sytatus(201)
        .json({ message: "시터정보 수정사항이 저장되었습니다." });
    } catch (err) {
      next(err);
    }
  };

  //시터 회원탈퇴
  deleteSitterSelf = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      await this.sittersService.deleteSitterSelf(password, email);

      res.clearCookies("accessToken");
      res.clearCookies("refreshToken");

      return res.ststus(200).json({ message: "시터 회원 탈퇴되었습니다." });
    } catch (err) {
      next(err);
    }
  };

   //ablePetType으로 필터해서 가져오는 시터목록
    getSittersBypetType = async (req, res, next) => {
        const { ablePetType } = req.query;

        try{ 
           if(!ablePetType){
            return res.status(400).json({ message : "종을 선택 해주세요."});
           }

           if(!['dog', 'cat', 'others'].includes(ablePetType.toLowerCase())){
            return res.status(400).json({ message: "종선택이 바르지 않습니다"})
           }

           const filleredSittersByPetType = await this.sittersService.getSitterBypetType(ablePetType)
           return res.status(200).json({ data:filleredSittersByPetType })
        } catch(err){
            next(err)
        }
    }

     //adrress_Sitters으로 필터해서 가져오는 시터목록
    getSittersByAddress = async ( req, res, next) => {
        const { address_Sitters } = req.query;
        try{ 
            if(!address_Sitters){
             return res.status(400).json({ message : "주소를 선택 해주세요."});
            }
 
            if(!['seoul',
                'gyeonggi',
                'gangwon',
                'chungbuk',
                'chungnam',
                'jeonbuk',
                'jeonnam',
                'gyeongbuk',
                'gyeongnam',
                'jeju'].includes(address_Sitters.toLowerCase())){
             return res.status(400).json({ message: "주소 선택이 바르지 않습니다"})
            }
 
            const filleredSittersByAddress = await this.sittersService.getSittersByAddress(address_Sitters)
            return res.status(200).json({ data:filleredSittersByAddress })
         } catch(err){
             next(err)
         }
    }

    

}