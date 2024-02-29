import { jest } from "@jest/globals";
import { ReviewsService } from "../../../src/services/review.services";

let mockReviewsRepository = {
  findUserById: jest.fn(),
  findSitterById: jest.fn(),
  createReview: jest.fn(),
  findReviewById: jest.fn(),
  updateReview: jest.fn(),
  deleteReview: jest.fn(),
};

let reviewsService = new ReviewsService(mockReviewsRepository);

describe("Reviews Service Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test("createReview Method", async () => {
    // findUserById Mock의 Return 값을 가상의 유저 데이터로 설정합니다.
    mockReviewsRepository.findUserById.mockReturnValue({
      userId: 1,
      password: "password",
    });

    // findSitterById Mock의 Return 값을 가상의 시터 데이터로 설정합니다.
    mockReviewsRepository.findSitterById.mockReturnValue({ sitterId: 1 });

    // createReview Mock의 Return 값을 "create Return String"으로 설정합니다.
    const mockReturn = "create Return String";
    mockReviewsRepository.createReview.mockReturnValue(mockReturn);

    // reviewsService의 createReview Method를 호출합니다.
    const createdReview = await reviewsService.createReview(
      1,
      "Title",
      "Content",
      "password",
      1,
      5
    );

    // mockReviewsRepository의 findUserById, findSitterById, createReview은 각각 1번씩 호출 되었습니다.
    expect(mockReviewsRepository.findUserById).toHaveBeenCalledTimes(1);
    expect(mockReviewsRepository.findSitterById).toHaveBeenCalledTimes(1);
    expect(mockReviewsRepository.createReview).toHaveBeenCalledTimes(1);

    // mockReviewsRepository의 Return과 출력된 createReview Method의 값이 일치하는지 비교합니다.
    expect(createdReview).toBe(mockReturn);
  });

  test("updateReview Method", async () => {
    // findUserById Mock의 Return 값을 가상의 유저 데이터로 설정합니다.
    mockReviewsRepository.findUserById.mockReturnValue({
      userId: 1,
      password: "password",
    });

    // findReviewById Mock의 Return 값을 가상의 리뷰 데이터로 설정합니다.
    mockReviewsRepository.findReviewById.mockReturnValue({
      reviewId: 1,
      title: "testReview",
    });

    // updateReview Mock의 Return 값을 가상의 업데이트된 리뷰 데이터로 설정합니다.
    const mockReturn = { reviewId: 1, title: "updatedReview" };
    mockReviewsRepository.updateReview.mockReturnValue(mockReturn);

    // reviewsService의 updateReview Method를 호출합니다.
    const updatedReview = await reviewsService.updateReview(
      1,
      "password",
      "newTitle",
      "newContent",
      4
    );

    // mockReviewsRepository의 findUserById, findReviewById, updateReview은 각각 1번씩 호출 되었습니다.
    expect(mockReviewsRepository.findUserById).toHaveBeenCalledTimes(1);
    expect(mockReviewsRepository.findReviewById).toHaveBeenCalledTimes(1);
    expect(mockReviewsRepository.updateReview).toHaveBeenCalledTimes(1);

    // mockReviewsRepository의 Return과 출력된 updateReview Method의 값이 일치하는지 비교합니다.
    expect(updatedReview).toEqual(mockReturn);
  });

  // Add a test for the invalid case where the review ID or password is incorrect.

  test("deleteReview Method", async () => {
    // findUserById Mock의 Return 값을 가상의 유저 데이터로 설정합니다.
    mockReviewsRepository.findUserById.mockReturnValue({
      userId: 1,
      password: "password",
    });

    // findReviewById Mock의 Return 값을 가상의 리뷰 데이터로 설정합니다.
    mockReviewsRepository.findReviewById.mockReturnValue({
      reviewId: 1,
      title: "testReview",
      userId: 1,
    });

    // deleteReview Mock의 Return 값을 가상의 삭제된 리뷰 데이터로 설정합니다.
    const mockReturn = { reviewId: 1, title: "deletedReview" };
    mockReviewsRepository.deleteReview.mockReturnValue(mockReturn);

    // reviewsService의 deleteReview Method를 호출합니다.
    const deletedReview = await reviewsService.deleteReview(1, 1, "password");

    // mockReviewsRepository의 findUserById, findReviewById, deleteReview은 각각 1번씩 호출 되었습니다.
    expect(mockReviewsRepository.findUserById).toHaveBeenCalledTimes(1);
    expect(mockReviewsRepository.findReviewById).toHaveBeenCalledTimes(1);
    expect(mockReviewsRepository.deleteReview).toHaveBeenCalledTimes(1);
    // mockReviewsRepository의 Return과 출력된 deleteReview Method의 값이 일치하는지 비교합니다.
    expect(deletedReview).toEqual(mockReturn);
  });
});
