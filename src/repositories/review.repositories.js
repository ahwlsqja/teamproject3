import { prisma } from '../routes/index.js';

export class ReviewsRepository {
    constructor(prisma){
        this.prisma = prisma;
    }
// 유저 찾기  
  findUserById = async(userId) => {
    return await this.prisma.users.findFirst({
        where: {
            userId: +userId
        }
    })
  }
// 아이디로 시터찾기
  findSitterById = async(sitterId) => {
    return await this.prisma.sitters.findFirst({
        where: {
            sitterId: +sitterId
        }
  })
}

// 리뷰 찾기
  findReviewById = async(reviewId) => {
    return await this.prisma.reviews.findFirst({
        where: {
            reviewId: +reviewId,

        }
    })
  }
  
  // 댓글 생성
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
    })
    }

}