import { ReviewsService } from "../services/review.services.js";

export class ReviewsController {
  constructor(reviewsService) {
    this.reviewsService = reviewsService;
  }

  // 리뷰 생성
  createReview = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { sitterId } = req.params;
      const { password, title, content, star } = req.body;

      if (!title || !content || !password || !star) {
        return res
          .status(400)
          .json({ message: "모든 입력칸을 입력해주세요. " });
      }

      if (!(1 <= star && star <= 5)) {
        throw new Error("평점은 1~5점 사이에서만 작성이 가능합니다.");
      }

      const createdReview = await this.reviewsService.createReview(
        userId,
        title,
        content,
        password,
        sitterId,
        star
      );

      return res.status(201).json({
        data: createdReview,
        message: "리뷰가 생성되었습니다.",
      });
    } catch (err) {
      next(err);
    }
  };

  // 리뷰 수정
  updateReview = async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { password, title, content, star } = req.body;
      const { userId } = req.user;

      if (!title || !content || !password || !star) {
        return res
          .status(400)
          .json({ message: "모든 입력칸을 입력해주세요. " });
      }

      if (!(1 <= star && star <= 5)) {
        throw new Error("평점은 1~5점 사이에서만 작성이 가능합니다.");
      }

      const updatedReview = await this.reviewsService.updateReview(
        reviewId,
        password,
        title,
        content,
        star,
        userId
      );

      return res.status(200).json({
        data: updatedReview,
        message: "리뷰가 수정되었습니다.",
      });
    } catch (err) {
      next(err);
    }
  };

  // 리뷰 삭제
  deleteReview = async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { userId } = req.user;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ message: "비밀번호를 입력해주세요." });
      }

      const deletedReview = await this.reviewsService.deleteReview(
        reviewId,
        userId,
        password
      );

      return res
        .status(200)
        .json({ data: deletedReview, message: "리뷰가 삭제되었습니다." });
    } catch (err) {
      next(err);
    }
  };

  // 특정 시터 평점 평균
  sitterExpert = async (req, res, next) => {
    try {
      const { sitterId } = req.params;

      if (!sitterId) {
        return res.status(400).json({ message: "시터 아이디를 입력해주세요." });
      }

      const sitterExperted = await this.reviewsService.sitterExpert(sitterId);

      return res.status(200).json({ data: sitterExperted });
    } catch (err) {
      next(err);
    }
  };

  // 특정 userId가 작성한 리뷰 찾기
  getReviewsByUserId = async (req, res, next) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ message: "유저 아이디를 입력해주세요." });
      }

      const reviews = await this.reviewsService.findReviewsByUserId(userId);

      return res.status(200).json({
        message: `${userId}번 유저가 작성한 리뷰입니다.`,
        data: reviews,
      });
    } catch (err) {
      next(err);
    }
  };

  // 특정 sitterId가 받은 리뷰 모아보기
  getReviewsBySitterId = async (req, res, next) => {
    try {
      const { sitterId } = req.params;

      if (!sitterId) {
        return res.status(400).json({ message: "시터 아이디를 입력해주세요." });
      }

      const reviews = await this.reviewsService.findReviewsBySitterId(sitterId);

      return res.status(200).json({
        message: `${sitterId}번 시터가 받은 리뷰입니다.`,
        data: reviews,
      });
    } catch (err) {
      next(err);
    }
  };
}
