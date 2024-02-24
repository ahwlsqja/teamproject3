export class PetService {
  constructor(petRepository) {
    this.petRepository = petRepository;
  }
  createPet = async ({ userId, name, petType, age, petImage }) => {
    try {
      if (!name) {
        throw new Error("이름은 필수입니다.");
      }
      if (!petType) {
        throw new Error("종류는 필수입니다.");
      }
      if (!age) {
        throw new Error("나이는 필수입니다.");
      }
      if (!petImage) {
        throw new Error("사진은 필수입니다.");
      }
      if (petType !== "DOG" && petType !== "CAT") {
        throw new Error("종류는 개와 고양이 중 하나입니다.");
      }

      const createdPet = await this.petRepository.createPet({
        userId,
        name,
        petType,
        age,
        petImage,
      });
      return createdPet;
    } catch (error) {
      next(error);
    }
  };
}
