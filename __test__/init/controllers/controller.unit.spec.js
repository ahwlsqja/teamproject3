import { beforeEach, describe, expect, jest } from "@jest/globals";
import { PetController } from "../../../src/controllers/pet.controller";

const mockPetService = {
  createPet: jest.fn(),
  findOnePet: jest.fn(),
  findUserPets: jest.fn(),
  updatePetInfo: jest.fn(),
  deletePetInfo: jest.fn(),
  findPetsByPetType: jest.fn(),
};

const mockRequest = {
  body: jest.fn(),
};

const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

const mockNext = jest.fn();

const petController = new PetController(mockPetService);

describe("Pet Controller Unit Test", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockResponse.status.mockReturnValue(mockResponse);
  });

  test("createPet", async () => {
    const sampleUser = { userId: 44 };
    const sampleImage = "사진";
    const samplePet = {
      namePet: "모진라면",
      petType: "dog",
      age: 57,
    };

    mockRequest.user = sampleUser;
    mockRequest.file = { Location: sampleImage };
    mockRequest.body = samplePet;

    const createdPet = {
      imageUrl: sampleImage,
      ...samplePet,
    };

    mockPetService.createPet.mockReturnValue(createdPet);

    await petController.createPet(mockRequest, mockResponse, mockNext);

    expect(mockPetService.createPet).toHaveBeenCalledTimes(1);
    expect(mockPetService.createPet).toHaveBeenCalledWith(
      sampleUser.userId,
      samplePet.namePet,
      samplePet.petType,
      samplePet.age,
      sampleImage
    );

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);

    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: createdPet });
  });

  test("findOnePet", async () => {
    const sampleUser = { userId: 44 };
    const samplePet = {
      petId: 12,
      namePet: "모진라면",
      petType: "dog",
      age: 57,
    };
    mockRequest.params = { petId: samplePet.petId };
    mockRequest.user = sampleUser;

    mockPetService.findOnePet.mockReturnValue(samplePet);

    await petController.findOnePet(mockRequest, mockResponse, mockNext);

    expect(mockPetService.findOnePet).toHaveBeenCalledTimes(1);
    expect(mockPetService.findOnePet).toHaveBeenCalledWith(
      samplePet.petId,
      sampleUser.userId
    );

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: samplePet });
  });

  test("findUserPets", async () => {
    const sampleUser = { userId: 44 };
    const samplePets = [
      {
        petId: 12,
        namePet: "모진라면",
        petType: "dog",
        age: 57,
      },
      {
        petId: 13,
        namePet: "모신라면",
        petType: "cat",
        age: 57,
      },
    ];

    mockRequest.params = { userId: sampleUser.userId };

    mockPetService.findUserPets.mockReturnValue(samplePets);

    await petController.findUserPets(mockRequest, mockResponse, mockNext);

    expect(mockPetService.findUserPets).toHaveBeenCalledTimes(1);
    expect(mockPetService.findUserPets).toHaveBeenCalledWith(sampleUser.userId);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: samplePets });
  });

  test("updatePetInfo", async () => {
    const sampleUser = { userId: 44 };
    const samplePet = {
      petId: 13,
      namePet: "모신라면",
      petType: "cat",
      age: 11,
    };
    const sampleImage = "치즈";

    mockRequest.user = sampleUser;
    mockRequest.params = { petId: samplePet.petId };
    mockRequest.body = samplePet;
    mockRequest.file = { Location: sampleImage };

    const updatedPet = { ...samplePet, imageUrl: sampleImage };
    mockPetService.updatePetInfo.mockReturnValue(updatedPet);

    await petController.updatePetInfo(mockRequest, mockResponse, mockNext);

    expect(mockPetService.updatePetInfo).toHaveBeenCalledTimes(1);
    expect(mockPetService.updatePetInfo).toHaveBeenCalledWith(
      sampleUser.userId,
      samplePet.petId,
      samplePet.namePet,
      samplePet.petType,
      samplePet.age,
      sampleImage
    );

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: updatedPet,
    });
  });

  test("deletePetInfo", async () => {
    const sampleUser = {
      userId: 123,
      email: "ahwlsddud@gmail.com",
      password: "123",
    };
    const samplePet = {
      petId: 13,
      namePet: "아오진영시치",
      petType: "cat",
      age: 11,
    };

    mockRequest.user = { userId: sampleUser.userId };
    mockRequest.params = { petId: samplePet.petId };
    mockRequest.body = {
      email: sampleUser.email,
      password: sampleUser.password,
    };

    mockPetService.deletePetInfo.mockReturnValue(samplePet);

    await petController.deletePetInfo(mockRequest, mockResponse, mockNext);

    expect(mockPetService.deletePetInfo).toHaveBeenCalledTimes(1);
    expect(mockPetService.deletePetInfo).toHaveBeenCalledWith(
      sampleUser.userId,
      samplePet.petId,
      sampleUser.email,
      sampleUser.password
    );

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "반려동물 정보가 삭제되었습니다.",
    });
  });
  test("findPetsByPetType", async () => {
    const samplePetType = { petType: "dog" };
    const mockRequest = { query: { petType: samplePetType.petType } };

    const samplePets = [
      {
        petId: 13,
        namePet: "아오진영시치",
        petType: "cat",
        age: 11,
      },
      {
        petId: 12,
        namePet: "mzymzy",
        petType: "dog",
        age: 11,
      },
    ];
    mockPetService.findPetsByPetType.mockReturnValue(samplePets);

    await petController.findPetsByPetType(mockRequest, mockResponse, mockNext);

    expect(mockPetService.findPetsByPetType).toHaveBeenCalledTimes(1);
    expect(mockPetService.findPetsByPetType).toHaveBeenCalledWith([
      samplePetType.petType,
    ]);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: samplePets });
  });
});
