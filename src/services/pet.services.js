export class PetService {
  constructor(petRepository) {
    this.petRepository = petRepository;
  }
  createPet = async (userId, namePet, petType, age, imageUrl) => {
      const createdPet = await this.petRepository.createPet(
        userId,
        namePet,
        petType,
        age,
        imageUrl);

      return createdPet;
  };

   // 펫 1마리 조회하기
   findOnePet = async (petId, userId) => {
      const isExistUser = await this.petRepository.findUserByUserId(userId);
      if (!isExistUser) {
        throw new Error("존재하지 않는 유저입니다.");
      }

      const pet = await this.petRepository.findOnePet(petId, userId);
      if (!pet) {
        throw new Error("해당하는 반려동물이 없습니다.");
      }
      return pet;
    }


  // 유저 1인의 모든펫 조회하기
  findUserPets = async (userId) => {
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
    } 

   // 펫 정보 수정하기
   updatePetInfo = async (userId, petId, name, petType, age, pet_Image) => {
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
  }

 // 펫 정보 삭제하기
 deletePetInfo = async (userId, petId, email, password) => {
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
  }

  // 종류별 펫 찾기
  findPetByPetType = async (petType) => {
    const isExistPetType = await this.petRepository.findPetByPetType(petType);
    return isExistPetType;
  } 

}


