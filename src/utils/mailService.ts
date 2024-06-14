import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter;

  constructor() {
    if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
      this.logger.error('Email credentials are not set in environment variables');
      throw new Error('Email credentials are not set in environment variables');
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Error configuring email transporter', error);
        throw new Error('Error configuring email transporter');
      } else {
        this.logger.log('Email transporter configured successfully');
      }
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      text,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Message sent: ${info.messageId}`);
    } catch (err) {
      this.logger.error('Error sending email: ', err.message);
      throw new Error(`Failed to send email: ${err.message}`);
    }
  }

  async sendWelcomeEmail(to: string, firstName: string, lastName: string): Promise<void> {
    const subject = 'Welcome to Our Service';
    const text = `Hello ${firstName} ${lastName},\n\nWelcome to our Fitness+! We are glad to have you with us.`;

    await this.sendMail(to, subject, text);
  }
}
