import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCreationDateInInvestment1720893447124
  implements MigrationInterface
{
  name = 'AddCreationDateInInvestment1720893447124'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "investment" ADD "creationDate" TIMESTAMP NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "investment" DROP COLUMN "creationDate"`,
    )
  }
}
