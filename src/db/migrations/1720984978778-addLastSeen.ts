import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddLastSeen1720984978778 implements MigrationInterface {
  name = 'AddLastSeen1720984978778'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investment" ADD "lastSeen" TIMESTAMP`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investment" DROP COLUMN "lastSeen"`)
  }
}
