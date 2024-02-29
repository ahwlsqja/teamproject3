import { jest } from "@jest/globals";
import { ReviewsController } from "../controllers/review.controller";
import { ReviewsService } from "../services/review.services";

// Mock ReviewsService
const mockReviewsService = {
  createReview: jest.fn(),
  updateReview: jest.fn(),
  deleteReview: jest.fn(),
  sitterExpert: jest.fn(),
};

// Create ReviewsController instance with the mock ReviewsService
const reviewsController = new ReviewsController(mockReviewsService);

describe("Reviews Controller Unit Test", () => {
  beforeEach(() => {
    jest.resetAllMocks(); // Reset all mock functions before each test
  });

  // Test createReview method
  test("createReview Method", async () => {
    // Mock request and response objects
    const req = {
      user: { userId: 1 },
      params: { sitterId: 2 },
      body: {
        password: "password",
        title: "Title",
        content: "Content",
        star: 4,
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const next = jest.fn();

    // Set up the mock implementation for createReview method
    mockReviewsService.createReview.mockResolvedValue({
      reviewId: 123,
      title: "Title",
      content: "Content",
      star: 4,
    });

    // Call the createReview method from the controller
    await reviewsController.createReview(req, res, next);

    // Verify that the mock service method was called with the correct arguments
    expect(mockReviewsService.createReview).toHaveBeenCalledWith(
      1,
      "Title",
      "Content",
      "password",
      2,
      4
    );

    // Verify the response status and json methods were called
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      data: { reviewId: 123, title: "Title", content: "Content", star: 4 },
      message: "리뷰가 생성되었습니다.",
    });

    // Verify that the next method was not called (no errors)
    expect(next).not.toHaveBeenCalled();
  });

  // Add similar tests for other methods (updateReview, deleteReview, sitterExpert)
});
