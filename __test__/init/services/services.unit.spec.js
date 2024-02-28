import { beforeEach, describe, expect, jest } from "@jest/globals";
import { PetService } from "../../../src/services/pet.services";
import bcrypt from "bcrypt";

const mockPetRepository = {
  createPet: jest.fn(),
  findOnePet: jest.fn(),
  findUserPets: jest.fn(),
  updatePetInfo: jest.fn(),
  deletePetInfo: jest.fn(),
  findPetsByPetType: jest.fn(),
};
const mockUserRepository = {
  findUserByUserId: jest.fn(),
  findUserIdForDeletePet: jest.fn(),
};
const sampleUser = { userId: 1 };
mockUserRepository.findUserIdForDeletePet.mockReturnValue(sampleUser);

const petService = new PetService(mockPetRepository, mockUserRepository);

describe("Pet Service Unit Test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("createPet Method By Success", async () => {
    const samplePet = {
      userId: sampleUser.userId,
      namePet: "강형욱",
      petType: "포메라니안",
      age: 45,
      imageUrl: "사진",
    };

    mockUserRepository.findUserByUserId.mockReturnValue(sampleUser);
    mockPetRepository.createPet.mockReturnValue(samplePet);

    const createdSamplePet = await petService.createPet(
      samplePet.userId,
      samplePet.namePet,
      samplePet.petType,
      samplePet.age,
      samplePet.imageUrl
    );

    expect(mockPetRepository.createPet).toHaveBeenCalledTimes(1);
    expect(mockPetRepository.createPet).toHaveBeenCalledWith(
      samplePet.userId,
      samplePet.namePet,
      samplePet.petType,
      samplePet.age,
      samplePet.imageUrl
    );
  });
  test("findOnePet", async () => {
    const samplePet = {
      userId: sampleUser.userId,
      petId: 1441,
    };
    mockUserRepository.findUserByUserId.mockReturnValue(sampleUser);
    mockPetRepository.findOnePet.mockReturnValue(samplePet);

    const foundPet = await petService.findOnePet(
      samplePet.petId,
      sampleUser.userId
    );

    expect(foundPet).toEqual(samplePet);

    expect(mockPetRepository.findOnePet).toHaveBeenCalledTimes(1);
    expect(mockPetRepository.findOnePet).toHaveBeenCalledWith(
      samplePet.petId,
      sampleUser.userId
    );
  });
  test("findUserPets", async () => {
    const samplePets = [
      {
        petId: "123",
        namePet: "강형욱",
        petType: "포메라니안",
        age: "45",
        pet_Image: "사진",
      },
      {
        petId: "456",
        namePet: "모진영",
        petType: "사람",
        age: "18",
        pet_Image: "사진",
      },
    ];

    mockUserRepository.findUserByUserId.mockReturnValue(sampleUser);
    mockPetRepository.findUserPets.mockReturnValue(samplePets);

    const foundPets = await petService.findUserPets(sampleUser.userId);

    expect(foundPets).toEqual(samplePets);

    expect(mockPetRepository.findUserPets).toHaveBeenCalledTimes(1);
    expect(mockPetRepository.findUserPets).toHaveBeenCalledWith(
      sampleUser.userId
    );
  });
  test("updatePetInfo", async () => {
    const samplePet = {
      userId: 123,
      petId: "456",
      namePet: "모진영",
      petType: "사람",
      age: "18",
      imageUrl: "사진",
    };
    const updatedPet = {
      userId: 123,
      petId: "456",
      namePet: "가",
      petType: "나",
      age: "18",
      imageUrl: "사진",
    };
    mockPetRepository.findOnePet.mockReturnValue(samplePet);
    mockPetRepository.updatePetInfo.mockReturnValue({
      ...samplePet,
      ...updatedPet,
    });

    const resultPet = await petService.updatePetInfo(
      updatedPet.userId,
      updatedPet.petId,
      updatedPet.namePet,
      updatedPet.petType,
      updatedPet.age,
      updatedPet.imageUrl
    );

    expect(resultPet).toEqual({ ...samplePet, ...updatedPet });

    expect(mockPetRepository.updatePetInfo).toHaveBeenCalledTimes(2);
    expect(mockPetRepository.updatePetInfo).toHaveBeenCalledWith(
      updatedPet.userId,
      updatedPet.petId,
      updatedPet.namePet,
      updatedPet.petType,
      updatedPet.age,
      updatedPet.imageUrl
    );
  });
  test("deletePetInfo", async () => {
    const sampleUser = {
      userId: 112,
      email: "mzy@gmail.com",
      password: await bcrypt.hash("aaaa4321", 9),
    };

    const samplePet = {
      userId: 123,
      petId: "456",
      namePet: "진영쿤",
      petType: "사람",
      age: "18",
      imageUrl: "사진",
    };

    mockUserRepository.findUserByUserId.mockReturnValue(sampleUser);
    mockUserRepository.findUserIdForDeletePet.mockReturnValue(sampleUser);
    mockPetRepository.findOnePet.mockReturnValue(samplePet);

    await petService.deletePetInfo(
      sampleUser.userId,
      samplePet.petId,
      sampleUser.email,
      "aaaa4321"
    );

    expect(mockPetRepository.deletePetInfo).toHaveBeenCalledTimes(1);
    expect(mockPetRepository.deletePetInfo).toHaveBeenCalledWith(
      sampleUser.userId,
      samplePet.petId
    );
  });
  test("findPetsByPetType", async () => {
    const sampleType = "고양이";
    const samplePetsByPetType = [
      {
        userId: 123,
        petId: "456",
        namePet: "진영쿤",
        petType: "고양이",
        age: "18",
        imageUrl: "사진",
      },
      {
        userId: 123,
        petId: "456",
        namePet: "모진영",
        petType: "고양이",
        age: "18",
        imageUrl: "사진",
      },
    ];
    mockPetRepository.findPetsByPetType.mockReturnValue(samplePetsByPetType);

    const pets = await petService.findPetsByPetType(sampleType);

    expect(pets).toEqual(samplePetsByPetType);

    expect(mockPetRepository.findPetsByPetType).toHaveBeenCalledTimes(1);
    expect(mockPetRepository.findPetsByPetType).toHaveBeenCalledWith(
      sampleType
    );
  });
});
