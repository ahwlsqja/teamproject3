import dotenv from 'dotenv';
import crypto from 'crypto';
import nodemailer from 'nodemailer';


dotenv.config();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GOOGLE_ID,
        pass: process.env.GOOGLE_PASS
    }
})

export const emailVerificationMiddleware = (email, token) => {
    try {
        const emailToken = crypto.randomBytes(64).toString('hex');
        const mailOptions = {
            from: 'ahwlsqja1324@gmail.com',
            to: email,
            subject: '이메일 인증을 위한 메일입니다',
            html: `<p>귀하의 인증 코드는 다음과 같습니다: ${token}</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return { error: '이메일 전송에 실패했습니다.' };
            } else {
                console.log('Email sent: ' + info.response);
                return { message: '인증코드메일을 발송했습니다.' };
            }
        });
        return res.status(201).json({ message: '인증코드메일을 발송했습니다. '});
    } catch(err) {
        console.error(err);
        return { error: '이메일 전송 중 오류가 발생했습니다.' };
    }
};