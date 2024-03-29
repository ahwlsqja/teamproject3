export class PetController {
  constructor(petService) {
    this.petService = petService;
  }

  createPet = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const imageUrl = req.file.Location;
      const { namePet, petType, age } = req.body;

      if (!namePet || !petType || !age || !imageUrl) {
        return res.status(400).json({ message: "필수값이 없습니다." });
      }
      if (!["dog", "cat", "others"].includes(petType.toLowerCase())) {
        return res
          .status(400)
          .json({ message: "dog, cat, others 중 하나를 입력해주세요." });
      }
      if (isNaN(age)) {
        return res.status(400).json({ message: "나이는 숫자입니다." });
      }

      const createdPet = await this.petService.createPet(
        userId,
        namePet,
        petType,
        age,
        imageUrl
      );
      return res.status(201).json({ data: createdPet });
    } catch (error) {
      next(error);
    }
  };
  // 펫 1마리 조회하기
  findOnePet = async (req, res, next) => {
    try {
      const { petId } = req.params;
      const { userId } = req.user;

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
      const { userId } = req.user;
      const { petId } = req.params;
      const { namePet, petType, age } = req.body;
      const imageUrl = req.file.Location;

      if (isNaN(age)) {
        return res.status(400).json({ message: "나이는 숫자입니다." });
      }
      if (!["dog", "cat", "others"].includes(petType.toLowerCase())) {
        return res
          .status(400)
          .json({ message: "dog, cat, others 중 하나를 입력해주세요." });
      }

      const updatePetInfo = await this.petService.updatePetInfo(
        userId,
        petId,
        namePet,
        petType,
        age,
        imageUrl
      );

      return res.status(200).json({ data: updatePetInfo });
    } catch (err) {
      next(err);
    }
  };

  // 펫 정보 삭제하기
  deletePetInfo = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { petId } = req.params;
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "모든 필드를 입력해주세요 " });
      }
      await this.petService.deletePetInfo(userId, petId, email, password);

      return res
        .status(200)
        .json({ message: "반려동물 정보가 삭제되었습니다." });
    } catch (err) {
      next(err);
    }
  };

  // 종류별 펫 찾기
  findPetsByPetType = async (req, res, next) => {
    try {
      const petType = req.query.petType.split(",");
      const petsByType = await this.petService.findPetsByPetType(petType);
      return res.status(200).json({ data: petsByType });
    } catch (err) {
      next(err);
    }
  };
}