import { Prisma } from "@prisma/client";

export class ReviewsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }


  // 특정 userId가 작성한 리뷰 찾기
  findReviewsByUserId = async (userId) => {
    return await this.prisma.reviews.findMany({
      where: {
        userId: +userId,
      },
    });
  };


  // 특정 sitterId가 받은 리뷰 모아보기
  findReviewsBySitterId = async (sitterId) => {
    return await this.prisma.reviews.findMany({
      where: {
        sitterId: +sitterId,
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

  // 댓글 생성
  createReview = async (userId, title, content, sitterId, star) => {
    const createdReview = await this.prisma.reviews.create({
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
  updateReview = async (reviewId, title, content, star) => {
    const updatedReview = await this.prisma.reviews.update({
      where: {
        reviewId: +reviewId,
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
  deleteReview = async (reviewId) => {
    return await this.prisma.reviews.delete({
      where: {
        reviewId: +reviewId,
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

   // 시터하나 별점 
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