import bcrypt from "bcrypt";

export class ReviewsService {
    constructor(reviewsRepository){
        this.reviewsRepository = reviewsRepository;
    }

  // 댓글 생성
  createReview = async (userId, title, content, password, sitterId) => {
    const isExistUser = await this.reviewsRepository.findUserById(userId);
    const isExistSitter = await this.reviewsRepository.findSitterById(sitterId);

    if(!isExistSitter){
        throw new error('해당 시터가 존재하지 않습니다.');  

    }
    if(!(await bcrypt.compare(password, isExistUser.password))){
        throw new error('비밀 번호가 틀렸습니다. 댓글을 작성할 권한이 없습니다.');  
    }
    const createdReview = await this.reviewsRepository.createReview(
      sitterId,
      userId,
      title,
      content,
    );

    return createdReview
  };

  // 댓글 수정
  updateReview = async (reviewId, password, title, content, sitterId, userId) => {
    const isExistUser = await this.reviewsRepository.findUserById(userId);
    const Review = await this.reviewsRepository.findReviewById(reviewId);

    if(!(await bcrypt.compare(password, isExistUser.password))){
        throw new error('비밀 번호가 틀렸습니다. 댓글을 작성할 권한이 없습니다.');  
    }

    if (!Review) {
        throw new Error('존재하지 않는 댓글입니다.');
    }



    const updatedReview = await this.reviewsRepository.updateReview(reviewId, title, content, sitterId);

    return updatedReview
  }


  // 댓글 삭제

  deleteReview = async (reviewId, userId, password) => {
    const isExistUser = await this.reviewsRepository.findUserById(userId);
    
    if(!(await bcrypt.compare(password, isExistUser.password))){
        throw new error('비밀 번호가 틀렸습니다. 댓글을 작성할 권한이 없습니다.');  
    }

    const review = await this.reviewsRepository.findReviewById(reviewId);

    if (!review){
        throw new Error('존재하지 않는 댓글입니다.');
    }

    if (review.users.id !== userId) {
      throw new error('댓글을 삭제할 권한이 없습니다.');
    }

    await this.reviewsRepository.deleteReview(reviewId);
  };
}