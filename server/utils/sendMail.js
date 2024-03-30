import nodemailer from "nodemailer";
import dotenv from "dotenv";
import dns from "dns";
import util from "util";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.GMAIL_USER_ID,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const resolveMxAsync = util.promisify(dns.resolveMx);

export const dnsErrorCodes = [
  "ENOTFOUND",
  "ENODATA",
  "EFORMERR",
  "ESERVFAIL",
  "ENOTIMP",
  "EREFUSED",
  "ETIMEOUT",
  "ECONNREFUSED",
];

async function sendEmail(toEmail, otp) {
  try {
    let domain = toEmail.split("@")[1];
    const addresses = await resolveMxAsync(domain);
    if (!addresses || addresses.length === 0) {
      throw new Error("Invalid domain");
    } else {
      const info = await transporter.sendMail({
        from: process.env.GMAIL_USER_ID,
        to: toEmail,
        subject: "DroidTech - Email Verification",
        text: `Thanks for signing up with DroidTech. Your verification code is ${otp}.`,
      });
      console.log("Email sent: " + info.response);
    }
  } catch (error) {
    throw error;
  }
}

export { sendEmail };
