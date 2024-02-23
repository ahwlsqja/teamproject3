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
