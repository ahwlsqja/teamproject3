
export class PetRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 펫 등록하기
  createPet = async (userId, namePet, petType, age, imageUrl) => {
    const createdPet = await this.prisma.pets.create({
      data: {
        namePet: namePet,
        petType: petType,
        age: +age,
        pet_Image: imageUrl,
        user: {
          connect: {
            userId: +userId,
          }
        }
      },
    });
    return createdPet;
  };


  // 펫 1마리 조회하기
  findOnePet = async (petId, userId) => {
    const findOnePet = await this.prisma.pets.findFirst({
      where: {
        petId: +petId,
        userId: +userId,
      },
    });
    return findOnePet;
  };

  // 유저 1인의 모든펫 조회하기
  findUserPets = async (userId) => {
    const findUserPets = await this.prisma.pets.findMany({
      where: { userId: +userId },
      select: {
        petId: true,
        name: true,
        petType: true,
        age: true,
        pet_Image: true,
      },
    });
    return findUserPets;
  };

  // 펫 정보 수정하기
  // email, password 정보로 찾으려 했는데 생각이 안남.
  updatePetInfo = async (userId, petId, name, petType, age, pet_Image) => {
    const updatedPetInfo = await this.prisma.pets.update({
      where: { userId: +userId, petId: +petId },
      data: {
        name,
        petType,
        age,
        pet_Image,
      },
    });
    return updatedPetInfo;
  };


  // 펫 정보 삭제하기
  deletePetInfo = async (userId, petId) => {
    const deletedPetInfo = await this.prisma.pets.delete({
      where: {
        userId: +userId,
        petId: +petId,
      },
    });
    return deletedPetInfo;
  };

  // 펫 종류별로 끌어오기
  findPetByPetType = async (petType) => {
    return await this.prisma.pets.findMany({
      where: {
        petType: petType,
      },
   });
}



}