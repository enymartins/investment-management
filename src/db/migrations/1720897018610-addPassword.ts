import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPassword1720897018610 implements MigrationInterface {
  name = 'AddPassword1720897018610'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "password" character varying`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`)
  }
}
