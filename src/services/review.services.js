import bcrypt from "bcrypt";

export class ReviewsService {
  constructor(reviewsRepository, sittersRepository, usersRepository) {
    this.reviewsRepository = reviewsRepository;
    this.sittersRepository = sittersRepository;
    this.usersRepository = usersRepository;
  }

  // 댓글 생성
  createReview = async (userId, title, content, password, sitterId, star) => {
    const isExistUser = await this.usersRepository.findUserByUserId(userId);
    const isExistSitter = await this.sittersRepository.findSitterById(sitterId);

    if (!isExistUser) {
      throw new Error("로그인을 먼저 진행해주세요.");
    }
    if (!isExistSitter) {
      throw new Error("해당 시터가 존재하지 않습니다.");
    }
    if (!(await bcrypt.compare(password, isExistUser.password))) {
      throw new Error("비밀 번호가 틀렸습니다. 댓글을 작성할 권한이 없습니다.");
    }

    const createdReview = await this.reviewsRepository.createReview(
      userId,
      title,
      content,
      sitterId,
      star
    );

    return createdReview;
  };

  // 댓글 수정
  updateReview = async (reviewId,password,title,content,star,userId) => {
    const isExistUser = await this.usersRepository.findUserByUserId(userId);
    const Review = await this.reviewsRepository.findReviewById(reviewId);

    if (!(await bcrypt.compare(password, isExistUser.password))) {
      throw new Error("비밀 번호가 틀렸습니다.");
    }

    if (!Review) {
      throw new Error("존재하지 않는 댓글입니다.");
    }

    const updatedReview = await this.reviewsRepository.updateReview(
      reviewId,
      title,
      content,
      star
    );

    return updatedReview;
  };

  // 댓글 삭제

  deleteReview = async (reviewId, userId, password) => {
    const isExistUser = await this.usersRepository.findUserByUserId(userId);

    if (!(await bcrypt.compare(password, isExistUser.password))) {
      throw new Error("비밀 번호가 틀렸습니다. 댓글을 삭제할 권한이 없습니다.");
    }

    const review = await this.reviewsRepository.findReviewById(reviewId);

    if (!review) {
      throw new Error("존재하지 않는 댓글입니다.");
    }

    if (review.userId !== userId) {
      throw new Error("댓글을 삭제할 권한이 없습니다.");
    }

    await this.reviewsRepository.deleteReview(reviewId);
  };

  // 목록 조회()
}