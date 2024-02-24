// 유저 레파지토리 내꺼~
export class UserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 유저 상세조회
  findUserByEmail = async (email) => {
    const user = await prisma.users.findFirst({
      where: { email: email },
    });
    return user;
  };

  // 반려동물 1마리 찾기
  findPet = async (petId) => {
    const pet = await prisma.pets.findFirst({
      where: { petId: +petId },
    });
    return pet;
  };

  // 로그인한 유저 프로필 조회
  findSignedUser = async (userId) => {
    const user = await prisma.users.findFirst({
      where: { userId: +userId },
    });
    return user;
  };
}
