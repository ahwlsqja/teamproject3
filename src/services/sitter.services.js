import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendTodayData } from "../middlewares/slackBot.js"
import "dotenv/config.js";
import { uploadUserImage } from "../middlewares/image.middleware.js"

export class SittersService {
    constructor(sittersRepository){
        this.sittersRepository = sittersRepository;
    }








    // 특정 시터의 상세 조회
    getSitterBySitterId = async(sitterId) => {
        const sumofSitterGrade = await this.sittersRepository.findManySitterId(sitterId)
        const stars = sumofSitterGrade.reviews.star
        let sum_star = 0
        for(const star of stars){
            sum_star += star
        }

        const sitter = await this.sittersRepository.getSitterBySitterId(sitterId);
        sitter.avg_rating = (sum_star / stars.length)
        if (!sitter) {
          throw new Error("시터를 찾지 못했습니다");
        }
    
        return sitter;
      };

      
    // 시터 평점순 목록 내림차순
    findManySitterId = async () => {
        const sitterInfo = await this.sittersRepository.findManyBySitter();
        const rankSitter = await this.reviewsRepository.findManySitterDesc();
        for(const rank of rankSitter){
          for(const sitter of sitterInfo){
            if(rank.sitterId === sitter.sitterId){
              rank.sitterName = sitter.name
              rank.sitterEmail = sitter.email
              rank.sitter
            }
          }
        }
        return rankSitter
      }
}