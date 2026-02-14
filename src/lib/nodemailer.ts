import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // type: "OAuth2",
    user: process.env.NODEMAILER_USER, // gamil account
    pass: process.env.NODEMAILER_APP_PASSWORD, // not gmail password, its a app password
  },
});

export default transporter;
