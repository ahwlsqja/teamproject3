import bcrypt from "bcrypt";

export class ReviewsService {
    constructor(reviewsRepository){
        this.reviewsRepository = reviewsRepository;
    }

  // 댓글 생성
  createReview = async (userId, title, content, password, sitterId, star) => {
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
      star,
    );

    return createdReview
  };

  // 댓글 수정
  updateReview = async (reviewId, password, title, content, userId, star) => {
    const isExistUser = await this.reviewsRepository.findUserById(userId);
    const Review = await this.reviewsRepository.findReviewById(reviewId);

    if(!(await bcrypt.compare(password, isExistUser.password))){
        throw new error('비밀 번호가 틀렸습니다. 댓글을 작성할 권한이 없습니다.');  
    }

    if (!Review) {
        throw new Error('존재하지 않는 댓글입니다.');
    }
    
    if(!(1 <= star <= 5)){
      throw new error("평점은 1~5점 사이에서만 작성이 가능합니다.");
    }


    const updatedReview = await this.reviewsRepository.updateReview(reviewId, title, content, star);

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

  // 시터 목록 조회 리뷰(평점순)
  findManySitterId = async () => {
    const sitterInfo = await this.sittersRepository.findManyBySitter();
    const rankSitter = await this.reviewsRepository.findManySitterDesc();
    for(const rank of rankSitter){
      for(const sitter of sitterInfo){
        if(rank.sitterId === sitter.sitterId){
          rank.sitterName = sitter.name
          rank.sitterEmail = sitter.email
        }
      }
    }
    return rankSitter
  }

  // 목록 조회()


}


