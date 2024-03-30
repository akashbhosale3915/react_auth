import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: process.env.GMAIL_USER_ID,
    pass: process.env.GMAIL_PASSWORD,
  },
});

async function sendEmail(toEmail, otp) {
  try {
    let info = await transporter.sendMail({
      from: process.env.GMAIL_USER_ID,
      to: toEmail,
      subject: 'DroidTech - Email Verification',
      text: `Thanks for signing up with DroidTech. Your verification code is ${otp}.`,
    });
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error occurred while sending email:', error);
  }
}

export { sendEmail };
