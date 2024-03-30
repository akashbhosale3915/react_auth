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

function renderRegisterTemplate(email, otp) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <title>Document</title>
    </head>
    <body>
      <div>
        <h1 style="color: orange">DroidTech</h1>
        <p style="font-weight: bold">Hello ${email},</p>
        <p>
          Thank you for choosing
          <span style="font-weight: bold">DroidTech</span>.
          use this OTP to complete your signup and verify your
          account on
          <span style="font-weight: bold">DroidTech</span>
        </p>
        <p
          style="
            font-weight: bold;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
          "
        >
          <span>OTP</span>
          <span
            style="
              background: black;
              color: white;
              padding: 10px;
              border-radius: 8px;
              margin-top: 10px;
            "
            >${otp}</span
          >
        </p>
      </div>
    </body>
  </html>
  `;
}

function resetPasswordTemplate(email, otp) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <title>Document</title>
    </head>
    <body>
      <div>
        <h1 style="color: orange">DroidTech</h1>
        <p style="font-weight: bold">Hello ${email},</p>
        <p>Use this OTP to reset your password.</p>
        <p
          style="
            font-weight: bold;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
          "
        >
          <span>OTP</span>
          <span
            style="
              background: black;
              color: white;
              padding: 10px;
              border-radius: 8px;
              margin-top: 10px;
            "
            >${otp}</span
          >
        </p>
      </div>
    </body>
  </html>
  `;
}

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

async function sendEmail(toEmail, subject, otp, path) {
  try {
    let domain = toEmail.split("@")[1];
    const addresses = await resolveMxAsync(domain);
    if (!addresses || addresses.length === 0) {
      throw new Error("Invalid domain");
    } else {
      const info = await transporter.sendMail({
        from: process.env.GMAIL_USER_ID,
        to: toEmail,
        subject,
        html:
          path === "register"
            ? renderRegisterTemplate(toEmail, otp)
            : resetPasswordTemplate(toEmail, otp),
      });
      console.log("Email sent: " + info.response);
    }
  } catch (error) {
    throw error;
  }
}

export { sendEmail };
