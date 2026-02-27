import nodemailer from "nodemailer";
import config from "../config/config";

export class EmailService {
  private transporter;

  constructor() {
    if (config.smtp.service === "gmail") {
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: config.smtp.user,
          clientId: config.smtp.googleClientId,
          clientSecret: config.smtp.googleClientSecret,
          refreshToken: config.smtp.googleRefreshToken,
        },
      });
    } else {
      this.transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: false, // true for 465, false for other ports
        auth: {
          user: config.smtp.user,
          pass: config.smtp.pass,
        },
      });
    }
  }

  async sendEmail(to: string, subject: string, content: string) {
    const mailOptions = {
      from: config.EMAIL_FROM,
      to: to,
      subject: subject,
      html: content,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}
