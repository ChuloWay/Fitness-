import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { MailService } from './mailService';
@Injectable()
export class CronService {
  constructor(
    private subscriptionService: SubscriptionService,
    private mailService: MailService,
  ) {}

  @Cron('0 0 * * *')
  async handleCron() {
    try {
      const currentDate = new Date();
      const subscriptions = await this.subscriptionService.findAllWithRelations();

      for (const subscription of subscriptions) {
        const { member, addOnServices, totalCost, type, isFirstMonth, dueDate } = subscription;

        // Determine if this is the first month
        if (isFirstMonth) {
          let reminderDate = new Date(dueDate);
          reminderDate.setDate(reminderDate.getDate() - 7);

          if (currentDate >= reminderDate) {
            const invoiceLink = this.generateInvoiceLink(subscription.id);
            const emailSubject = `Fitness+ Membership Reminder - ${type}`;
            const emailMessage = `
              Dear ${member.firstName} ${member.lastName},

              Your first month's invoice is due on ${dueDate.toDateString()}.
              Total amount: $${totalCost}.
              
              View your invoice here: ${invoiceLink}

              Thank you,
              Fitness+
            `;
            await this.sendInvoiceReminder(member.email, emailSubject, emailMessage);
          }
        } else {
          for (const service of addOnServices) {
            const serviceDueDate = new Date(service.dueDate);
            if (currentDate.getMonth() === serviceDueDate.getMonth() && currentDate.getFullYear() === serviceDueDate.getFullYear()) {
              const invoiceLink = this.generateInvoiceLink(service.id);
              const emailSubject = 'Fitness+ Membership Reminder';
              const emailMessage = `
                Dear ${member.firstName} ${member.lastName},

                Your add-on service "${service.name}" invoice is due this month.
                Monthly amount: $${service.monthlyAmount}.
                
                View your invoice here: ${invoiceLink}

                Thank you,
                Fitness+
              `;
              await this.sendInvoiceReminder(member.email, emailSubject, emailMessage);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error running daily cron job:', error.message);
    }
  }

  private generateInvoiceLink(subscriptionId: number): string {
    //i can make use of quickbook for generating Invoices
    return `http://yourdomain.com/invoice/${subscriptionId}`;
  }

  private async sendInvoiceReminder(email: string, subject: string, message: string) {
    await this.mailService.sendMail(email, subject, message);
  }
}
