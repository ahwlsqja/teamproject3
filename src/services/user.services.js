export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
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
