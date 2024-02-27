export class ReviewsController {
    constructor(reviewsService){
        this.reviewsService = reviewsService;
    }

  // 댓글 생성
  createReview = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { sitterId } = req.params;
      const { password, title, content, star } = req.body;

      if(!userId || !title || !content || !password || !sitterId || !star){
        return res.status(400).json({ message : "모든 입력칸을 입력해주세요. "});
      }

      const createdReview = await this.reviewsService.createReview(
        userId, 
        title, 
        content, 
        password, 
        sitterId,
        star,
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
      const { password, title, content, star } = req.body;
      const { userId } = req.user;

      if(!title || !content || !password || !star){
        return res.status(400).json({ message : "모든 입력칸을 입력해주세요. "});
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
      const { userId } = req.user;
      const { password } = req.body;

      if(!password){
        return res.status(400).json({ message : "모든 입력칸을 입력해주세요. "});
      }

      const deletedReview = await this.reviewsService.deleteReview(reviewId, userId, password);

      return res.status(200).json({ data: deletedReview });
    } catch (err) {
      next(err);
    }
  };

  // 특정 시터 평점 평균
  sitterExpert = async (req, res, next) => {
    try{
      const { sitterId } = req.params;

      if(!sitterId){
        return res.status(400).json({ message : "모든 입력칸을 입력해주세요. "});
      }

      const sitterExperted = await this.reviewsService.sitterExpert(sitterId);

      return res.status(200).json({ data: sitterExperted });
    } catch (err) {
      next(err);
    }
  }


}