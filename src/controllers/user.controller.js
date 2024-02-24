export class UserController {
  constructor(userService) {
    this.userService = userService;
  }
}

// 유저 상세조회
findUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await UserService.findUserByEmail(email);

    return res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
};

// 로그인한 유저 프로필 조회
getLoginedUser = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await UserService.findSignedUser(userId);

    return res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
};
