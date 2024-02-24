export class PetController {
  constructor(petService) {
    this.petService = petService;
  }

  createPet = async (req, res, next) => {
    try {
      const userId = res.locals.user.userId;
      const { name, petType, age, petImage } = req.body;
      const createdPet = await this.petService.createPet({
        userId,
        name,
        petType,
        petImage,
        age,
      });
      return res.status(201).json({ data: createdPet });
    } catch (error) {
      next(error);
    }
  };
}
