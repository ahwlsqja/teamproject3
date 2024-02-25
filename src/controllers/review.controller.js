import { ReviewsService } from '../services/review.services.js';
export class ReviewsController {
  reviewsService = new ReviewsService();

  // 댓글 생성
  createReview = async (req, res, next) => {
    try {
      const { userId, postId, title, content } = req.body;

      const createdReview = await this.reviewsService.createReview(
        userId,
        postId,
        title,
        content
      );

      return res.status(201).json({
        data: createdReview,
        message: '댓글이 생성되었습니다.',
      });
    } catch (err) {
      next(err);
    }
  };

  // 댓글 수정
  updateReview = async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { content, status } = req.body;

      const updatedReview = await this.reviewsService.updateReview(
        reviewId,
        content,
        status
      );

      return res.status(200).json({
        data: updatedReview,
        message: '댓글이 수정되었습니다.',
      });
    } catch (err) {
      next(err);
    }
  };

  // 댓글 삭제
  deleteReview = async (req, res, next) => {
    try {
      const { reviewId } = req.params;

      const deletedReview = await this.reviewsService.deleteReview(reviewId);

      return res.status(200).json({ data: deletedReview });
    } catch (err) {
      next(err);
    }
  };
}
