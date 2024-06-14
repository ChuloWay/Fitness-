# Fitness+ Membership Management Backend

This repository contains the backend implementation for Fitness+, a gym membership management system. The system supports various billing structures, including annual and monthly dues, and optional add-on services. The backend is built using Nest.js and PostgreSQL, and it includes a comprehensive RESTful API, email functionality using Gmail SMTP, and a cron job to send reminders for upcoming membership fees.

## Technologies Used

- [Nest.js](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Swagger](https://swagger.io/)
- [Jest](https://jestjs.io/)
- [NodeMailer]()

### Setup Steps

1. **Clone the repo:**

   ```bash
   git clone https://github.com/ChuloWay/fitnessPlus
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create an env file:**

   - Duplicate the `.env.example` file in the project root.
   - Rename the duplicated file to `.env`.
   - Open the `.env` file and set your variables as shown in the example file.

   ```bash
   cp .env.example .env
   ```

   Ensure to fill in the necessary values in the `.env` file for a smooth configuration.

4. **Run Migrations:**

    ```bash
    npm run apply:migration
    ```

5. **Start your server:**

   ```bash
   npm run start:dev
   ```

## Data Model

| Entity             | Attribute            | Description                                                               |
| ------------------ | -------------------- | ------------------------------------------------------------------------- |
| **Member**         | Membership ID        | Unique identifier for each member                                         |
|                    | First Name           | First name of the member                                                  |
|                    | Last Name            | Last name of the member                                                   |
|                    | Membership type      | Type of membership (e.g., Annual Basic, Monthly Premium)                  |
|                    | Start date           | Date when the membership started                                          |
|                    | Due date             | Due date for annual memberships or monthly due date for add-on services   |
|                    | Total amount         | Total amount for annual memberships or monthly amount for add-on services |
|                    | Member email address | Email address of the member                                               |
|                    | IsFirstMonth         | Boolean flag indicating if it's the first month of the membership         |
| **Subscription**   | ID                   | Unique identifier for each subscription                                   |
|                    | Member               | Relation to Member entity                                                 |
|                    | Type                 | Type of subscription (Annual or Monthly)                                  |
|                    | StartDate            | Start date of the subscription                                            |
|                    | DueDate              | Due date of the subscription                                              |
|                    | TotalAmount          | Total amount for the subscription                                         |
|                    | IsFirstMonth         | Boolean flag indicating if it's the first month of the subscription       |
| **Add-On Service** | ID                   | Unique identifier for each add-on service                                 |
|                    | Name                 | Name of the add-on service                                                |
|                    | MonthlyCharge        | Monthly charge for the add-on service                                     |
| **Invoice**        | ID                   | Unique identifier for each invoice                                        |
|                    | Member               | Relation to Member entity                                                 |
|                    | Amount               | Amount for the invoice                                                    |
|                    | Date                 | Date when the invoice was generated                                       |

## Cron Job

A cron job is implemented to run daily and check for upcoming membership fees. It differentiates between annual memberships and add-on services, considering the IsFirstMonth flag.

- For new members (first month):
- Calculate the reminder date (e.g., 7 days before the due date) based on the annual membership due date.
- Send an email reminder with the membership type, total amount for the combined annual fee and first month's add-on service charges, and a link to the full invoice.
- For existing members (subsequent months):
- Check if the current date falls within the month for which the add-on service applies.
- Send an email reminder with the service name, monthly amount, and a link to the invoice for that specific month's add-on service charge.

## Email Functionality

The system uses Gmail SMTP to send email reminders. The email content includes:

- Subject: Fitness+ Membership Reminder - \[Membership Type\]
- Body: A message reminding the member about the upcoming payment, including the membership details (type, due date for annual or month for add-on services), and a link to the relevant invoice.

## Testing

Unit tests are written using Jest to ensure the functionality of the code. Run the tests with:`npm run test`

## Swagger Documentation

Swagger is integrated for API documentation. Access the Swagger UI at [http://localhost:3000/api/docs](http://localhost:3000/api/docs).

## Development Process

The development process involved the following steps:

1.  **Setting up the Nest.js project**:

- Created a new Nest.js project and installed necessary dependencies.
- Set up PostgreSQL as the database using TypeORM.

1.  **Designing the data model**:

- Created entities for Member, Subscription, Add-On Service, and Invoice.

1.  **Implementing the SeederService**:

- Developed a seeder service to populate the database with initial data.
- Wrote unit tests for the seeder service.

1.  **Implementing the cron job**:

- Developed a cron job to check for upcoming membership fees and send email reminders.

1.  **Setting up email functionality**:

- Configured NodeMailer to use Gmail SMTP for sending emails.

1.  **Adding Swagger documentation**:

- Integrated Swagger for API documentation.
- Documented the API endpoints using Swagger decorators.

1.  **Writing unit tests**:

- Wrote comprehensive unit tests to ensure the functionality of the code.
- Ran tests to verify the correctness of the implementation.

## Conclusion

This backend system for Fitness+ is designed to be robust, scalable, and easy to maintain. The system correctly identifies upcoming due dates, sends reminder emails, and supports various billing structures. With comprehensive documentation and testing, the codebase is well-structured and easy to understand.
