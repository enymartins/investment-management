import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddLastUpdated1720980445378 implements MigrationInterface {
  name = 'AddLastUpdated1720980445378'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "investment" ADD "lastUpdated" TIMESTAMP`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "investment" DROP COLUMN "lastUpdated"`,
    )
  }
}
