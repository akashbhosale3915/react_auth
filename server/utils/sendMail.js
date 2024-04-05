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

function renderRegisterTemplate(otp) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <title>Attractive Email Template</title>
      <style>
        /* Make it more visually appealing with CSS styles */
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
  
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
  
        h1 {
          color: #333;
          text-align: center;
        }
  
        p {
          color: #666;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 style="color: #007bff; text-align: center">
          Welcome to DroidTech!
        </h1>
        <p style="text-align: center">
          Thank you for joining us. Please use the OTP below
          to complete your registration:
        </p>
        <div
          style="
            text-align: center;
            background-color: #007bff;
            color: #fff;
            padding: 10px;
            border-radius: 5px;
            margin: 20px 0;
          "
        >
          <strong>${otp}</strong>
        </div>
      </div>
    </body>
  </html>
  `;
}

function resetPasswordTemplate(otp) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <title>Attractive Email Template</title>
      <style>
        /* Make it more visually appealing with CSS styles */
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
  
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
  
        h1 {
          color: #333;
          text-align: center;
        }
  
        p {
          color: #666;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 style="color: #007bff; text-align: center">
          Reset Password
        </h1>
        <p style="text-align: center">
          Please use the OTP below to change your password
        </p>
        <div
          style="
            text-align: center;
            background-color: #007bff;
            color: #fff;
            padding: 10px;
            border-radius: 5px;
            margin: 20px 0;
          "
        >
          <strong>${otp}</strong>
        </div>
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
            ? renderRegisterTemplate(otp)
            : resetPasswordTemplate(otp),
      });
      console.log("Email sent: " + info.response);
    }
  } catch (error) {
    throw error;
  }
}

export { sendEmail };
