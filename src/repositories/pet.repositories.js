export class PetRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 펫 등록하기
  createPet = async (userId, namePet, petType, age, imageUrl) => {
    return await this.prisma.pets.create({
      data: {
        namePet: namePet,
        petType: petType,
        age: +age,
        pet_Image: imageUrl,
        user: {
          connect: {
            userId: +userId,
          },
        },
      },
    });
  };

  // 펫 1마리 조회하기
  findOnePet = async (petId, userId) => {
    return await this.prisma.pets.findFirst({
      where: {
        petId: +petId,
        userId: +userId,
      },
    });
  };

  // 유저 1인의 모든펫 조회하기
  findUserPets = async (userId) => {
    return await this.prisma.pets.findMany({
      where: { userId: +userId },
    });
  };

  // 펫 정보 수정하기
  updatePetInfo = async (userId, petId, namePet, petType, age, pet_Image) => {
    return await this.prisma.pets.update({
      where: { userId: +userId, petId: +petId },
      data: {
        namePet,
        petType,
        age: +age,
        pet_Image,
      },
    });
  };

  // 펫 정보 삭제하기
  deletePetInfo = async (userId, petId) => {
    return await this.prisma.pets.delete({
      where: {
        userId: +userId,
        petId: +petId,
      },
    });
  };

  // 펫 종류별로 끌어오기
  findPetsByPetType = async (petType) => {
    return await this.prisma.pets.findMany({
      where: {
        petType: {
          in: petType,
        },
      },
    });
  };
}