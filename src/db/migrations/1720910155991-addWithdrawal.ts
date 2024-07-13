import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddWithdrawal1720910155991 implements MigrationInterface {
  name = 'AddWithdrawal1720910155991'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "withdrawal" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "amount" numeric(10,2) NOT NULL, "withdrawalDate" TIMESTAMP NOT NULL DEFAULT now(), "investmentId" uuid, CONSTRAINT "PK_840e247aaad3fbd4e18129122a2" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_840e247aaad3fbd4e18129122a" ON "withdrawal" ("id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_1e01eb0b8dd1e8a22edc53859c" ON "withdrawal" ("updated_at") `,
    )
    await queryRunner.query(
      `ALTER TABLE "investment" DROP COLUMN "withdrawalDate"`,
    )
    await queryRunner.query(
      `ALTER TABLE "investment" DROP COLUMN "withdrawnAmount"`,
    )
    await queryRunner.query(
      `ALTER TABLE "withdrawal" ADD CONSTRAINT "FK_cc1271e50b19a0e4029903a2258" FOREIGN KEY ("investmentId") REFERENCES "investment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "withdrawal" DROP CONSTRAINT "FK_cc1271e50b19a0e4029903a2258"`,
    )
    await queryRunner.query(
      `ALTER TABLE "investment" ADD "withdrawnAmount" numeric(15,2) NOT NULL DEFAULT '0'`,
    )
    await queryRunner.query(
      `ALTER TABLE "investment" ADD "withdrawalDate" TIMESTAMP`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1e01eb0b8dd1e8a22edc53859c"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_840e247aaad3fbd4e18129122a"`,
    )
    await queryRunner.query(`DROP TABLE "withdrawal"`)
  }
}
