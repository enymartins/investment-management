import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddInvestment1720828638027 implements MigrationInterface {
  name = 'AddInvestment1720828638027'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "investment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "clientId" character varying NOT NULL, "originalAmount" numeric(15,2) NOT NULL, "amount" numeric(15,2) NOT NULL, "withdrawalDate" TIMESTAMP, "withdrawnAmount" numeric(15,2) NOT NULL DEFAULT '0', CONSTRAINT "PK_ad085a94bd56e031136925f681b" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ad085a94bd56e031136925f681" ON "investment" ("id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_886a89bb1efcd3b222a0a66684" ON "investment" ("updated_at") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_8c01bc74f491e2c5bb4cf98eb7" ON "investment" ("created_at") `,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8c01bc74f491e2c5bb4cf98eb7"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_886a89bb1efcd3b222a0a66684"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ad085a94bd56e031136925f681"`,
    )
    await queryRunner.query(`DROP TABLE "investment"`)
  }
}
