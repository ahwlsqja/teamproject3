import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendTodayData } from "../middlewares/slackBot.js"
import "dotenv/config.js";
import { uploadUserImage } from "../middlewares/image.middleware.js"

export class SittersService {
    constructor(sittersRepository){
        this.sittersRepository = sittersRepository;
    }
}