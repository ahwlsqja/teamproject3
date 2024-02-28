import bcrypt from "bcrypt";
export class PetService {
  constructor(petRepository, usersRepository) {
    this.petRepository = petRepository;
    this.usersRepository = usersRepository;
  }
  //userID
  createPet = async (userId, namePet, petType, age, imageUrl) => {
    const isExistUser = await this.usersRepository.findUserByUserId(userId);
    if (!isExistUser) {
      throw new Error("로그인이 되지 않았습니다. 허허");
    }
    const createdPet = await this.petRepository.createPet(
      userId,
      namePet,
      petType,
      age,
      imageUrl
    );

    return createdPet;
  };

  // 펫 1마리 조회하기
  findOnePet = async (petId, userId) => {
    const isExistUser = await this.usersRepository.findUserByUserId(userId);
    if (!isExistUser) {
      throw new Error("해당하는 사용자가 없습니다.");
    }
    const pet = await this.petRepository.findOnePet(petId, userId);

    if (!pet) {
      throw new Error("해당하는 반려동물이 존재하지 않습니다.");
    }
    return pet;
  };

  // 유저 1인의 모든펫 조회하기
  findUserPets = async (userId) => {
    const isExistUser = await this.usersRepository.findUserByUserId(userId);
    if (!isExistUser) {
      throw new Error("해당하는 사용자가 없습니다.");
    }

    const userPets = await this.petRepository.findUserPets(userId);
    if (!userPets || userPets.length === 0) {
      throw new Error("해당하는 반려동물이 존재하지 않습니다.");
    }

    return userPets.map((pet) => ({
      petId: pet.petId,
      namePet: pet.namePet,
      petType: pet.petType,
      age: pet.age,
      pet_Image: pet.pet_Image,
    }));
  };

  // 펫 정보 수정하기
  updatePetInfo = async (userId, petId, namePet, petType, age, imageUrl) => {
    const pet = await this.petRepository.findOnePet(petId, userId);
    if (!pet) {
      throw new Error("해당하는 반려동물이 존재하지 않습니다.");
    }
    await this.petRepository.updatePetInfo(
      userId,
      petId,
      namePet,
      petType,
      age,
      imageUrl
    );

    // 변경된 데이터를 조회함
    const updatedPet = await this.petRepository.updatePetInfo(
      userId,
      petId,
      namePet,
      petType,
      age,
      imageUrl
    );
    return updatedPet;
  };

  // 펫 정보 삭제하기
  deletePetInfo = async (userId, petId, email, password) => {

    const isExistUser = await this.usersRepository.findUserByUserId(userId);
    if (!isExistUser) {
      throw new Error("해당하는 사용자가 없습니다.");
    }

    if (email !== isExistUser.email) {
      throw new Error("이메일이 일치하지 않습니다.");
    }

    if (!(await bcrypt.compare(password, isExistUser.password))) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }

    const pet = await this.petRepository.findOnePet(petId, userId);
    if (!pet) {
      throw new Error("해당하는 반려동물이 없습니다.");
    }
    await this.petRepository.deletePetInfo(userId, petId);
  };

  // 종류별 펫 찾기
  findPetsByPetType = async (petType) => {
    const isExistPetsType = await this.petRepository.findPetsByPetType(petType);

    return isExistPetsType;
  };
}