import { jest } from "@jest/globals";
import { ReviewsRepository } from "../../../src/repositories/review.repositories";

let mockPrisma = {
  posts: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    groupBy: jest.fn(),
  },
};

let reviewsRepository = new ReviewsRepository(mockPrisma);

describe("Reviews Repository Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test("findUserById Method", async () => {
    // findFirst Mock의 Return 값을 가상의 사용자 데이터로 설정합니다.
    const mockReturn = { userId: 1, username: "testUser" };
    mockPrisma.users.findFirst.mockReturnValue(mockReturn);

    // reviewsRepository의 findUserById Method를 호출합니다.
    const foundUser = await reviewsRepository.findUserById(1);

    // prisma.users의 findFirst는 1번만 호출 되었습니다.
    expect(mockPrisma.users.findFirst).toHaveBeenCalledTimes(1);

    // mockPrisma의 Return과 출력된 findFirst Method의 값이 일치하는지 비교합니다.
    expect(foundUser).toEqual(mockReturn);
  });

  test("findSitterById Method", async () => {
    // findFirst Mock의 Return 값을 가상의 시터 데이터로 설정합니다.
    const mockReturn = { sitterId: 1, sitterName: "testSitter" };
    mockPrisma.sitters.findFirst.mockReturnValue(mockReturn);

    // reviewsRepository의 findSitterById Method를 호출합니다.
    const foundSitter = await reviewsRepository.findSitterById(1);

    // prisma.sitters의 findFirst는 1번만 호출 되었습니다.
    expect(mockPrisma.sitters.findFirst).toHaveBeenCalledTimes(1);

    // mockPrisma의 Return과 출력된 findFirst Method의 값이 일치하는지 비교합니다.
    expect(foundSitter).toEqual(mockReturn);
  });

  test("findReviewById Method", async () => {
    // findFirst Mock의 Return 값을 가상의 리뷰 데이터로 설정합니다.
    const mockReturn = { reviewId: 1, title: "testReview" };
    mockPrisma.reviews.findFirst.mockReturnValue(mockReturn);

    // reviewsRepository의 findReviewById Method를 호출합니다.
    const foundReview = await reviewsRepository.findReviewById(1);

    // prisma.reviews의 findFirst는 1번만 호출 되었습니다.
    expect(mockPrisma.reviews.findFirst).toHaveBeenCalledTimes(1);

    // mockPrisma의 Return과 출력된 findFirst Method의 값이 일치하는지 비교합니다.
    expect(foundReview).toEqual(mockReturn);
  });

  test("createReview Method", async () => {
    // create Mock의 Return 값을 "create Return String"으로 설정합니다.
    const mockReturn = "create Return String";
    mockPrisma.reviews.create.mockReturnValue(mockReturn);

    // reviewsRepository의 createReview Method를 호출합니다.
    const createdReview = await reviewsRepository.createReview(
      1,
      "Title",
      "Content",
      1,
      5
    );

    // prisma.reviews의 create는 1번 실행합니다.
    expect(mockPrisma.reviews.create).toHaveBeenCalledTimes(1);

    // mockPrisma의 Return과 출력된 create Method의 값이 일치하는지 비교합니다.
    expect(createdReview).toBe(mockReturn);
  });

  test("updateReview Method", async () => {
    // update Mock의 Return 값을 가상의 업데이트된 리뷰 데이터로 설정합니다.
    const mockReturn = { reviewId: 1, title: "updatedReview" };
    mockPrisma.reviews.update.mockReturnValue(mockReturn);

    // reviewsRepository의 updateReview Method를 호출합니다.
    const updatedReview = await reviewsRepository.updateReview(
      1,
      "password",
      "newTitle",
      "newContent",
      4
    );

    // prisma.reviews의 update는 1번만 호출 되었습니다.
    expect(mockPrisma.reviews.update).toHaveBeenCalledTimes(1);

    // mockPrisma의 Return과 출력된 update Method의 값이 일치하는지 비교합니다.
    expect(updatedReview).toEqual(mockReturn);
  });

  test("deleteReview Method", async () => {
    // delete Mock의 Return 값을 가상의 삭제된 리뷰 데이터로 설정합니다.
    const mockReturn = { reviewId: 1, title: "deletedReview" };
    mockPrisma.reviews.delete.mockReturnValue(mockReturn);

    // reviewsRepository의 deleteReview Method를 호출합니다.
    const deletedReview = await reviewsRepository.deleteReview(1, "password");

    // prisma.reviews의 delete는 1번만 호출 되었습니다.
    expect(mockPrisma.reviews.delete).toHaveBeenCalledTimes(1);

    // mockPrisma의 Return과 출력된 delete Method의 값이 일치하는지 비교합니다.
    expect(deletedReview).toEqual(mockReturn);
  });
});
