export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  // 유저 상세 조회
  findUserByEmail = async (email) => {
    const user = await this.userRepository.findUserByEmail(email);

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

  // 로그인한 유저 프로필 조회
  findSignedUser = async (userId) => {
    const user = await this.userRepository.findSignedUser(userId);

    if (!user) {
      throw new Error("존재하지 않는 유저입니다.");
    }

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
