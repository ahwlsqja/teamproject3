import { Prisma } from "@prisma/client";

export class ReviewsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  // 유저 찾기
  findUserById = async (userId) => {
    return await this.prisma.users.findFirst({
      where: {
        userId: +userId,
      },
    });
  };

  // 리뷰 찾기
  findReviewById = async (reviewId) => {
    return await this.prisma.reviews.findFirst({
      where: {
        reviewId: +reviewId,
      },
    });
  };

  // 리뷰 생성
  createReview = async (userId, title, content, sitterId, star) => {
    const createdReview = await prisma.reviews.create({
      data: {
        userId: +userId,
        sitterId: +sitterId,
        title,
        content,
        star,
      },
    });

    return createdReview;
  };

  // 댓글 수정
  updateReview = async (reviewid, title, content, star) => {
    const updatedReview = await prisma.reviews.update({
      where: {
        reviewid: Number(reviewid),
      },
      data: {
        title,
        content,
        star,
      },
    });

    return updatedReview;
  };

  // 댓글 삭제
  deleteReview = async (reviewid) => {
    return await prisma.reviews.delete({
      where: {
        reviewid: Number(reviewid),
      },
    });
  };

  // 목록 조회(평점순 내림차순)
  findManySitterDesc = async () => {
    const reviewsList = await this.prisma.reviews.groupBy({
      by: ["sitterId"],
      _avg: {
        star: true,
      },
    });

    // 별점 평균 내림차순으로 정렬합니다.
    const sortedReviews = reviewsList.sort((a, b) => b._avg.star - a._avg.star);

    return sortedReviews;
  };

  // 목록 조회(평점순 내림차순)
  findSittersavgstar = async (sitterId) => {
    const reviewsList = await this.prisma.reviews.groupBy({
      by: ["sitterId"],
      _avg: {
        star: true,
      },
      where: { sitterId: +sitterId },
    });
    return reviewsList;
  };

  // 목록 조회(평점순 오름차순)
  findManySitterAsc = async () => {
    const reviewsList = await this.prisma.reviews.groupBy({
      by: ["sitterId"],
      _avg: {
        star: true,
      },
    });

    // 별점 평균 내림차순으로 정렬합니다.
    const sortedReviews = reviewsList.sort((a, b) => a._avg.star - b._avg.star);

    return sortedReviews;
  };
}
