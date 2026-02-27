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
      console.log("Send email with ses smtp");

      this.transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
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
      ses: {
        // Optional SES-specific options can be added here
        ConfigurationSetName: "my-config-set",
        EmailTags: [{ Name: "tag_name", Value: "tag_value" }],
      },
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
