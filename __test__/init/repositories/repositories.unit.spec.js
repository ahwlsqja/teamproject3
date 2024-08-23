import { beforeEach, describe, expect, jest } from "@jest/globals";
import { PetRepository } from "../../../src/repositories/pet.repositories";

let mockPrisma = {
  pets: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

let petRepository = new PetRepository(mockPrisma);

describe("Pet Repository Unit Test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("createPet", async () => {
    const mockReturn = "create Return String";
    mockPrisma.pets.create.mockReturnValue(mockReturn);
    const samplePet = {
      userId: 1,
      namePet: "강형욱",
      petType: "dog",
      age: "42",
      pet_Image: "123",
    };

    const createdPetData = await petRepository.createPet(samplePet);

    expect(createdPetData).toBe(mockReturn);

    expect(mockPrisma.pets.create).toHaveBeenCalledTimes(1);

    expect(mockPrisma.pets.create).toHaveBeenCalledWith({
      data: {
        namePet: createdPetData.namePet,
        petType: createdPetData.petType,
        age: +createdPetData.age,
        pet_Image: createdPetData.imageUrl,
        user: {
          connect: {
            userId: +createdPetData.userId,
          },
        },
      },
    });
  });
  test("findOnePet", async () => {
    const mockReturn = "findFirst string";
    mockPrisma.pets.findFirst.mockReturnValue(mockReturn);

    const samplePet = await petRepository.findOnePet({
      petId: "1",
      userId: "2",
    });

    expect(samplePet).toBe(mockReturn);

    expect(petRepository.prisma.pets.findFirst).toHaveBeenCalledTimes(1);

    expect(petRepository.prisma.pets.findFirst).toHaveBeenCalledWith({
      where: { petId: +samplePet.petId, userId: +samplePet.petId },
    });
  });
  test("findUserPets", async () => {
    const mockReturn = "findMany string";
    mockPrisma.pets.findMany.mockReturnValue(mockReturn);

    const samplePets = await petRepository.findUserPets({
      userId: "1",
    });

    expect(samplePets).toBe(mockReturn);

    expect(petRepository.prisma.pets.findMany).toHaveBeenCalledTimes(1);
    expect(petRepository.prisma.pets.findMany).toHaveBeenCalledWith({
      where: { userId: +samplePets.userId },
    });
  });
  test("updatePetInfo", async () => {
    const mockReturn = "update string";
    mockPrisma.pets.update.mockReturnValue(mockReturn);

    const updatedSamplePet = await petRepository.updatePetInfo({
      userId: 1,
      petId: 5500,
      namePet: "뭉탱이",
      age: "55",
      pet_Image: "사진",
    });
    expect(updatedSamplePet).toBe(mockReturn);

    expect(petRepository.prisma.pets.update).toHaveBeenCalledTimes(1);
    expect(petRepository.prisma.pets.update).toHaveBeenCalledWith({
      where: {
        userId: +updatedSamplePet.userId,
        petId: +updatedSamplePet.petId,
      },
      data: {
        namePet: updatedSamplePet.namePet,
        petType: updatedSamplePet.petType,
        age: +updatedSamplePet.age,
        pet_Image: updatedSamplePet.pet_Image,
      },
    });
  });
  test("deletePetInfo", async () => {
    const mockReturn = "delete string";
    mockPrisma.pets.delete.mockReturnValue(mockReturn);

    const deletedSamplePet = await petRepository.deletePetInfo({
      userId: 123,
      petId: 456,
    });
    expect(deletedSamplePet).toBe(mockReturn);

    expect(petRepository.prisma.pets.delete).toHaveBeenCalledTimes(1);
    expect(petRepository.prisma.pets.delete).toHaveBeenCalledWith({
      where: {
        userId: +deletedSamplePet.userId,
        petId: +deletedSamplePet.petId,
      },
    });
  });
  test("findPetsByPetType", async () => {
    const mockReturn = "findMany string";
    mockPrisma.pets.findMany.mockReturnValue(mockReturn);

    const samplePetPetType = "기린";
    const samplePetByPetType = await petRepository.findPetsByPetType(
      samplePetPetType
    );
    expect(samplePetByPetType).toBe(mockReturn);

    expect(petRepository.prisma.pets.findMany).toHaveBeenCalledTimes(1);
    expect(petRepository.prisma.pets.findMany).toHaveBeenCalledWith({
      where: {
        petType: {
          in: samplePetPetType,
        },
      },
    });
  });
});
