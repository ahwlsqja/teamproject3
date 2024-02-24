export class PetRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  createPet = async ({ userId, name, petType, age, petImage }) => {
    const createdPet = await this.prisma.pets.create({
      data: {
        userId,
        name,
        petType,
        age,
        petImage,
      },
    });
    return createdPet;
  };
}
