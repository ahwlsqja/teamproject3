export class PetController {
  constructor(petService) {
    this.petService = petService;
  }

  // 펫 등록하기
  createPet = async (req, res, next) => {
    try {
      const userId = res.locals.userId;
      const { name, petType, age, pet_Image } = req.body;
      const createdPet = await this.petService.createPet({
        userId,
        name,
        petType,
        pet_Image,
        age,
      });
      return res.status(201).json({ data: createdPet });
    } catch (err) {
      next(err);
    }
  };

  // 펫 1마리 조회하기
  findOnePet = async (req, res, next) => {
    try {
      const { petId } = req.params;
      const { userId } = req.locals.userId;

      const pet = await this.petService.findOnePet(petId, userId);

      return res.status(200).json({ data: pet });
    } catch (err) {
      next(err);
    }
  };

  // 유저 1인의 모든펫 조회하기
  findUserPets = async (req, res, next) => {
    try {
      const { userId } = req.params;

      const pets = await this.petService.findUserPets(userId);

      return res.status(200).json({ data: pets });
    } catch (err) {
      next(err);
    }
  };

  // 펫 정보 수정하기
  updatePetInfo = async (req, res, next) => {
    try {
      const { userId } = req.user.userId;
      const { petId } = req.params;
      const { name, petType, age, pet_Image } = req.body;

      const updatePetInfo = await this.petService.updatePetInfo(
        userId,
        petId,
        name,
        petType,
        age,
        pet_Image
      );

      return res.status(200).json({ data: updatePetInfo });
    } catch (err) {
      next(err);
    }
  };

  // 펫 정보 삭제하기
  deletePetInfo = async (req, res, next) => {
    try {
      const { userId } = req.user.userId;
      const { petId } = req.params;
      const { email, password } = req.body;
      const deletedPetInfo = await this.petService.deletePetInfo(
        userId,
        petId,
        email,
        password
      );
      return res.status(200).json({
        message: "반려동물 정보가 삭제되었습니다.",
        data: deletedPetInfo,
      });
    } catch (err) {
      next(err);
    }
  };

  // 종류별 펫 찾기
  findPetByPetType = async (req, res, next) => {
    try {
      const { petType } = req.body;
      const petTypeInfo = await this.petService.findPetByPetType(petType);
      return res.status(200).json({ data: petTypeInfo });
    } catch (err) {
      next(err);
    }
  };
}
