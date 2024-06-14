import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { MailService } from './mailService';
import { InvoiceService } from 'src/invoice/invoice.service';
@Injectable()
export class CronService {
  constructor(
    private subscriptionService: SubscriptionService,
    private invoiceService: InvoiceService,
    private mailService: MailService,
  ) {}

  /**
   * Handles the cron job that runs daily and checks for upcoming membership fees.
   *
   * @return {Promise<void>} A promise that resolves when the cron job is completed.
   */
  @Cron('0 0 * * *')
  async handleCron() {
    try {
      const currentDate = new Date();
      const subscriptions = await this.subscriptionService.findDueInNextSevenDays();

      for (const subscription of subscriptions) {
        const { member, addOnServices, totalCost, type, isFirstMonth, dueDate, invoice } = subscription;

        let invoiceLink = invoice?.link;

        if (!invoiceLink) {
          invoiceLink = this.generateInvoiceLink(subscription.id);
          await this.invoiceService.updateInvoiceLink(subscription.id, invoiceLink);
        }

        if (isFirstMonth) {
          let reminderDate = new Date(dueDate);
          reminderDate.setDate(reminderDate.getDate() - 7);

          if (currentDate >= reminderDate) {
            const emailSubject = `Fitness+ Membership Reminder - ${type}`;
            const emailMessage = `
              Dear ${member.firstName} ${member.lastName},

              Your first month's invoice is due on ${dueDate.toDateString()}.
              Total amount: $${totalCost.toFixed(2)}.

              Here is a breakdown of your charges:
              - Membership Type: ${type}
              - Base Amount: $${subscription.totalAmount.toFixed(2)}
              ${addOnServices.length > 0 ? '- Add-On Services:' : ''}
              ${addOnServices.map((service) => `  - ${service.name}: $${service.monthlyAmount.toFixed(2)}`).join('\n')}

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
              const emailSubject = `Fitness+ Membership Reminder - ${type}`;
              const emailMessage = `
                Dear ${member.firstName} ${member.lastName},

                Your add-on service "${service.name}" invoice is due this month.
                Monthly amount: $${service.monthlyAmount.toFixed(2)}.

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
    return `http://fitnessplus.com/invoice/${subscriptionId}`;
  }

  /**
   * Sends an invoice reminder email to the specified email address.
   *
   * @param {string} email - The email address to send the reminder to.
   * @param {string} subject - The subject of the email.
   * @param {string} message - The message content of the email.
   * @return {Promise<void>} - A promise that resolves when the email is sent.
   */
  private async sendInvoiceReminder(email: string, subject: string, message: string) {
    await this.mailService.sendMail(email, subject, message);
  }
}
