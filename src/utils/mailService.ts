import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      text,
    };

    try {
      if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
        throw new Error('Email credentials are not set in environment variables');
      }

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
    } catch (err) {
      console.error('Error sending email: ', err);
      throw err;
    }
  }

  async sendWelcomeEmail(to: string, firstName: string, lastName: string): Promise<void> {
    const subject = 'Welcome to Our Service';
    const text = `Hello ${firstName} ${lastName},\n\nWelcome to our Fitness+! We are glad to have you with us.`;

    await this.sendMail(to, subject, text);
  }
}
