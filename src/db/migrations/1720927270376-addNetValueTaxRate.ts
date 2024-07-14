import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNetValueTaxRate1720927270376 implements MigrationInterface {
    name = 'AddNetValueTaxRate1720927270376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP CONSTRAINT "FK_cc1271e50b19a0e4029903a2258"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP COLUMN "investmentId"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD "netValue" numeric(15,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD "taxRate" numeric(5,4) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD "investment_id" uuid`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ALTER COLUMN "amount" TYPE numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD CONSTRAINT "FK_3665bc33cf0d96f6d185bef5a2a" FOREIGN KEY ("investment_id") REFERENCES "investment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP CONSTRAINT "FK_3665bc33cf0d96f6d185bef5a2a"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ALTER COLUMN "amount" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP COLUMN "investment_id"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP COLUMN "taxRate"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP COLUMN "netValue"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD "investmentId" uuid`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD CONSTRAINT "FK_cc1271e50b19a0e4029903a2258" FOREIGN KEY ("investmentId") REFERENCES "investment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
