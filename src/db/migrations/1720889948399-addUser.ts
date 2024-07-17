import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUser1720889948399 implements MigrationInterface {
  name = 'AddUser1720889948399'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8c01bc74f491e2c5bb4cf98eb7"`,
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "cpf" character varying NOT NULL, CONSTRAINT "UQ_a6235b5ef0939d8deaad755fc87" UNIQUE ("cpf"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_cace4a159ff9f2512dd4237376" ON "user" ("id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_9cdce43fa0043c794281aa0905" ON "user" ("updated_at") `,
    )
    await queryRunner.query(`ALTER TABLE "investment" DROP COLUMN "clientId"`)
    await queryRunner.query(`ALTER TABLE "investment" DROP COLUMN "deleted_at"`)
    await queryRunner.query(`ALTER TABLE "investment" DROP COLUMN "created_at"`)
    await queryRunner.query(`ALTER TABLE "investment" ADD "user_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "investment" ADD CONSTRAINT "FK_e4f0cfe94d01377877528a764b2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "investment" DROP CONSTRAINT "FK_e4f0cfe94d01377877528a764b2"`,
    )
    await queryRunner.query(`ALTER TABLE "investment" DROP COLUMN "user_id"`)
    await queryRunner.query(
      `ALTER TABLE "investment" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "investment" ADD "deleted_at" TIMESTAMP`,
    )
    await queryRunner.query(
      `ALTER TABLE "investment" ADD "clientId" character varying NOT NULL`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9cdce43fa0043c794281aa0905"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cace4a159ff9f2512dd4237376"`,
    )
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(
      `CREATE INDEX "IDX_8c01bc74f491e2c5bb4cf98eb7" ON "investment" ("created_at") `,
    )
  }
}
