import { ReviewsRepository } from '../repositories/review.repositories.js';

export class ReviewsService {
  reviewsRepository = new ReviewsRepository();

  // 댓글 생성
  createReview = async (userId, title, content, status) => {
    const createdReview = await this.reviewsRepository.createReview(
      userId,
      title,
      content,
      status
    );

    return {
      postId: createdReview.postId,
      reviewId: createdReview.reviewId,
      userId: createdReview.userId,
      title: createdReview.title,
      content: createdReview.content,
      status: createdReview.status,
      createdAt: createdReview.createdAt,
    };
  };

  // 댓글 수정
  updateReview = async (reviewId, password, title, content, status) => {
    const Review = await this.reviewsRepository.findReviewById(reviewId);

    if (!Review) throw new Error('존재하지 않는 댓글입니다.');

    await this.reviewsRepository.updateReview(
      reviewId,
      password,
      title,
      content,
      status
    );

    const updatedReview = await this.reviewsRepository.findReviewById(reviewId);

    return {
      reviewId: updatedReview.reviewId,
      title: updatedReview.title,
      content: updatedReview.content,
      status: updatedReview.status,
      createdAt: updatedReview.createdAt,
      updatedAt: updatedReview.updatedAt,
    };
  };

  deleteReview = async (reviewId, userId) => {
    const review = await this.reviewsRepository.findReviewById(reviewId);
    if (!review) throw new Error('존재하지 않는 댓글입니다.');

    if (review.user.id !== userId) {
      throw new error('댓글을 삭제할 권한이 없습니다.');
    }

    await this.reviewsRepository.deleteReview(reviewId);

    return {
      review: review.reviewId,
      title: review.title,
      content: review.content,
      createdAt: review.createdAt,
    };
  };
}
