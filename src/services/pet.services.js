import { IoTJobsDataPlane } from "aws-sdk";
import { assign } from "nodemailer/lib/shared";

export class PetService {
  constructor(petRepository) {
    this.petRepository = petRepository;
  }

  // 펫 등록하기
  createPet = async ({ userId, name, petType, age, pet_Image }) => {
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
      if (!pet_Image) {
        throw new Error("사진은 필수입니다.");
      }
      if (petType !== "DOG" && petType !== "CAT" && petType !== "Others") {
        throw new Error("개나 고양이 또는 그 이외의 것 셋 하나만 골라주세요.");
      }

      const createdPet = await this.petRepository.createPet({
        userId,
        name,
        petType,
        age,
        pet_Image,
      });

      return createdPet;
    } catch (err) {
      next(err);
    }
  };

  // 펫 1마리 조회하기
  findOnePet = async (petId, userId) => {
    try {
      const isExistUser = await this.petRepository.getUserById(userId);
      if (!isExistUser) {
        throw new Error("존재하지 않는 유저입니다.");
      }

      const pet = await this.petRepository.findOnePet(petId, userId);
      if (!pet) {
        throw new Error("해당하는 반려동물이 없습니다.");
      }
      return pet;
    } catch (err) {
      next(err);
    }
  };

  // 유저 1인의 모든펫 조회하기
  findUserPets = async (userId) => {
    try {
      if (!userId) {
        throw Error("유저 정보가 존재하지 않습니다.");
      }

      const userPets = await this.petRepository.findUserPets(userId);
      return userPets.map((pet) => ({
        petId: pet.petId,
        name: pet.name,
        petType: pet.petType,
        age: pet.age,
        pet_Image: pet.pet_Image,
      }));
    } catch (err) {
      next(err);
    }
  };

  // 펫 정보 수정하기
  updatePetInfo = async (userId, petId, name, petType, age, pet_Image) => {
    try {
      const pet = await this.petRepository.pets.findOnePet(userId, petId); // 펫 한마리 찾기
      if (!pet) {
        throw new Error("존재하지 않는 반려동물 입니다.");
      }
      if (!(userId || name || petType || age || petImage)) {
        throw new Error("필수 입력 정보를 입력해주세요.");
      }
      if (petType !== "DOG" && petType !== "CAT" && petType !== "Others") {
        throw new Error("종류는 개와 고양이 중 하나입니다.");
      }
      // 저장소에 업데이트를 요청한다
      await this.petRepository.updatePetInfo(
        userId,
        petId,
        name,
        petType,
        age,
        pet_Image
      );

      // 변경된 데이터를 조회함
      const updatePetInfo = await this.petRepository.findOnePet(userId, petId);
      if (!updatePetInfo) {
        throw new Error("존재하지 않는 반려동물입니다.");
      }
      return {
        userId: updatePetInfo.userId,
        petId: updatePetInfo.petId,
        name: updatePetInfo.name,
        petType: updatePetInfo.petType,
        age: updatePetInfo.age,
        pet_Image: updatePetInfo.petImage,
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
        if (!userEmail) {
          throw new Error("존재하지 않는 이메일입니다.");
        }

        const userPassword = await this.petRepository.getUserPassword(userId);
        if (password !== userPassword) {
          throw new Error("비밀번호가 일치하지 않습니다.");
        }

        // 저장소에서 찾을 펫
        const pet = await this.petRepository.deletePetInfo(userId, petId);
        if (!pet) {
          throw new Error("존재하지 않는 반려동물입니다.");
        }

        return pet;
      } catch (err) {
        next(err);
      }
    };
  };

  // 종류별 펫 찾기
  findPetByPetType = async (petType) => {
    try {
      const isExistPetType = await this.petRepository.findPetByPetType(petType);
      if (
        isExistPetType !== "DOG" &&
        isExistPetType !== "CAT" &&
        isExistPetType !== "Others"
      ) {
        throw new Error("해당 종류의 반려동물은 존재하지 않습니다.");
      }
      return isExistPetType;
    } catch (err) {
      next(err);
    }
  };

   // 펫 1마리 조회하기
   findOnePet = async (petId, userId) => {
    try {
      const isExistUser = await this.petRepository.findUserByUserId(userId);
      if (!isExistUser) {
        throw new Error("존재하지 않는 유저입니다.");
      }

      const pet = await this.petRepository.findOnePet(petId, userId);
      if (!pet) {
        throw new Error("해당하는 반려동물이 없습니다.");
      }
      return pet;
    } catch (err) {
      next(err);
    }
  };

  // 유저 1인의 모든펫 조회하기
  findUserPets = async (userId) => {
    try {
      if (!userId) {
        throw Error("유저 정보가 존재하지 않습니다.");
      }

      const userPets = await this.petRepository.findUserPets(userId);
      return userPets.map((pet) => ({
        petId: pet.petId,
        name: pet.name,
        petType: pet.petType,
        age: pet.age,
        pet_Image: pet.pet_Image,
      }));
    } catch (err) {
      next(err);
    }
  };

   // 펫 정보 수정하기
   updatePetInfo = async (userId, petId, name, petType, age, pet_Image) => {
    try {
      const pet = await this.petRepository.pets.findOnePet(userId, petId); // 펫 한마리 찾기
      if (!pet) {
        throw new Error("존재하지 않는 반려동물 입니다.");
      }
    
      // 저장소에 업데이트를 요청한다
      await this.petRepository.updatePetInfo(
        userId,
        petId,
        name,
        petType,
        age,
        pet_Image
      );

      // 변경된 데이터를 조회함
      const updatedPet = await this.petRepository.updatePetInfo(
        userId,
        petId,
        name,
        petType,
        age,
        pet_Image
      );
      return updatedPet;
    } catch (err) {
      next(err);
    }

  }

 // 펫 정보 삭제하기
 deletePetInfo = async (userId, petId, email, password) => {
  try {
    const isExistUser = await this.petRepository.findUserByUserId(userId);
    if (email !== isExistUser.email) {
      throw new Error("이메일이 일치하지 않습니다.");
    }
    if (!email) {
      throw new Error("존재하지 않는 이메일입니다.");
    }

    if(!(await bcrypt.compare(password, isExistUser.password))){
        throw new error('비밀 번호가 틀렸습니다. 삭제할 권한이 없습니다.');  
    }

    // 저장소에서 찾을 펫
   await this.petRepository.deletePetInfo(userId, petId);
  } catch (err) {
    next(err);
  }
};

// 종류별 펫 찾기
  findPetByPetType = async (petType) => {
  try {
    const isExistPetType = await this.petRepository.findPetByPetType(petType);
    return isExistPetType;
  } catch (err) {
    next(err);
  }
};

}


