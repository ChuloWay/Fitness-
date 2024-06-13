import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitEnitities1718299047094 implements MigrationInterface {
  name = 'InitEnitities1718299047094';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4678079964ab375b2b31849456c" UNIQUE ("email"), CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "add_on_service" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "monthlyAmount" numeric(10,2) NOT NULL, "dueDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "subscription_id" uuid, "member_id" uuid, CONSTRAINT "PK_b4037ca4a7cc1b721c9d9c09878" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoice" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(10,2) NOT NULL, "invoiceDate" TIMESTAMP NOT NULL, "link" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "subscription_id" uuid, CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subscription_type_enum" AS ENUM('Annual Basic', 'Monthly Premium', 'Annual Premium', 'Monthly Basic')`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."subscription_type_enum" NOT NULL, "startDate" TIMESTAMP NOT NULL, "dueDate" TIMESTAMP, "totalAmount" numeric(10,2) NOT NULL, "isFirstMonth" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "member_id" uuid, CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "add_on_service" ADD CONSTRAINT "FK_4e56b997fbdcd08e35572a5012d" FOREIGN KEY ("subscription_id") REFERENCES "subscription"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "add_on_service" ADD CONSTRAINT "FK_4d6f39480701b9830dca6e6961d" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_5d9508325a862b5b3c7c819de3e" FOREIGN KEY ("subscription_id") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "FK_170c0b338138b3cb9862d7142d9" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_170c0b338138b3cb9862d7142d9"`);
    await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_5d9508325a862b5b3c7c819de3e"`);
    await queryRunner.query(`ALTER TABLE "add_on_service" DROP CONSTRAINT "FK_4d6f39480701b9830dca6e6961d"`);
    await queryRunner.query(`ALTER TABLE "add_on_service" DROP CONSTRAINT "FK_4e56b997fbdcd08e35572a5012d"`);
    await queryRunner.query(`DROP TABLE "subscription"`);
    await queryRunner.query(`DROP TYPE "public"."subscription_type_enum"`);
    await queryRunner.query(`DROP TABLE "invoice"`);
    await queryRunner.query(`DROP TABLE "add_on_service"`);
    await queryRunner.query(`DROP TABLE "member"`);
  }
}
