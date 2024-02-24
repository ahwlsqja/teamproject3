import { prisma } from '../routes/index.js';

export class ReviewsRepository {
  // 댓글 생성
  createReview = async (userId, title, content, status) => {
    const createdReview = await prisma.reviews.create({
      data: {
        userId: Number(userId),
        title,
        content,
        status,
      },
    });

    return createdReview;
  };

  // 댓글 수정
  updateReview = async (reviewid, title, content, status) => {
    const updatedReview = await prisma.reviews.update({
      where: {
        reviewid: Number(reviewid),
      },
      data: {
        title,
        content,
        status,
      },
    });

    return updatedReview;
  };

  // 댓글 삭제
  deleteReview = async (reviewid) => {
    const deletedReview = await prisma.reviews.delete({
      where: {
        reviewid: Number(reviewid),
      },
    });

    return deletedReview;
  };
}
