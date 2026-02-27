import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import nodemailer from "nodemailer";

const sesClient = new SESv2Client({ region: process.env.AWS_REGION });

// 2. Create a Nodemailer transport configured to use SES
export const sesTransporter = nodemailer.createTransport({
  SES: { sesClient, SendEmailCommand },
});

// // 3. Send the message
// const info = transporter.sendMail({
//   from: "sender@example.com",
//   to: "recipient@example.com",
//   subject: "Hello from Nodemailer + SES",
//   text: "I hope this message gets sent!",
//   // You can pass additional SES-specific options under the `ses` key:
//   ses: {
//     ConfigurationSetName: "my-config-set",
//     EmailTags: [{ Name: "tag_name", Value: "tag_value" }],
//   },
// });
