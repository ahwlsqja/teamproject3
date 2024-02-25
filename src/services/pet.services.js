import { IoTJobsDataPlane } from "aws-sdk";
import { assign } from "nodemailer/lib/shared";

export class PetService {
  constructor(petRepository) {
    this.petRepository = petRepository;
  }

  // 펫 등록하기
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

  // 펫 1마리 조회하기
  findOnePet = async (petId, userId) => {
    try {
      if (!petId) {
        throw new Error("petId를 입력해주세요.");
      }
      if (!userId) {
        throw new Error("userId를 입력해주세요.");
      }
      if (petId !== this.petRepository.pets.petId) {
        throw new Error("일치하지 않는 petId입니다.");
      }
      if (userId !== this.petRepository.pets.userId) {
        throw new Error("일치하지 않는 uerId입니다.");
      }

      const pet = await this.petRepository.findOnePet(petId, userId);
      return {
        petId: pet.petId,
        name: pet.name,
        // users 테이블에서 userId를 가져옴
        users: {
          select: {
            userId: true,
          },
        },
        petType: findOnePet.petType,
        age: findOnePet.age,
        petImage: findOnePet.petImage,
      };
    } catch (err) {
      next(err);
    }
  };

  // 유저 1인의 모든펫 조회하기
  findUserPets = async (userId) => {
    if (!userId) {
      throw Error("유저 정보가 존재하지 않습니다.");
    }

    const userPets = await this.petRepository.findUserPets(userId);
    try {
      return {
        petId: userPets.petId,
        name: userPets.name,
        petType: userPets.petType,
        age: userPets.age,
        petImage: userPets.petImage,
      };
    } catch (err) {
      next(err);
    }
  };

  // 펫 정보 수정하기
  updatePetInfo = async (userId, petId, name, petType, age, petImage) => {
    try {
      const pet = await this.petRepository.pets.findOnePet(userId, petId); // 펫 한마리 찾기
      if (!pet) {
        throw new Error("존재하지 않는 반려동물 입니다.");
      }
      if (!(userId || name || petType || age || petImage)) {
        throw new Error("필수 입력 정보를 입력해주세요.");
      }
      // 저장소에 업데이트를 요청한다
      await this.petRepository.updatePetInfo(
        userId,
        petId,
        name,
        petType,
        age,
        petImage
      );

      // 변경된 데이터를 조회함
      const updatePetInfo = await this.petRepository.findOnePet(userId, petId);

      return {
        userId: updatePetInfo.userId,
        petId: updatePetInfo.petId,
        name: updatePetInfo.name,
        petType: updatePetInfo.petType,
        age: updatePetInfo.age,
        petImage: updatePetInfo.petImage,
      };
    } catch (err) {
      next(err);
    }

    // 펫 정보 삭제하기
    deletePetInfo = async (userId, petId, email, password) => {
      try {
        const userEmail = await this.petRepository.getUserEmail(userId);
        if (email !== userEmail) {
          throw new Error("이메일이 일치하지 않습니다.");
        }

        const userPassword = await this.petRepository.getUserPassword(userId);
        if (password !== userPassword) {
          throw new Error("비밀번호가 일치하지 않습니다.");
        }

        // 저장소에서 찾을 펫
        const pet = await this.petRepository.findOnePet(userId, petId);
        if (!pet) {
          throw new Error("존재하지 않는 반려동물입니다.");
        }

        return {
          petId: pet.petId,
          name: pet.name,
          userId: pet.userId,
          petType: pet.petType,
          age: pet.age,
          pet_image: pet.pet_image,
        };
      } catch (err) {
        next(err);
      }
    };
  };
}
