import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendTodayData } from "../middlewares/slackBot.js"
import "dotenv/config.js";
import { uploadUserImage } from "../middlewares/image.middleware.js"

export class SittersService {
    constructor(sittersRepository){
        this.sittersRepository = sittersRepository;
    }

    // 시터 목록 조회 리뷰(평점 높은순)
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
}