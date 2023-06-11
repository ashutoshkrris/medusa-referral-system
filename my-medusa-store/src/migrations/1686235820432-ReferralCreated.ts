import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class ReferralCreated1686235820432 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "referral",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        isPrimary: true,
                    },
                    {
                        name: "referral_code",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "referrer_customer_id",
                        type: "varchar",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            })
        );

        await queryRunner.createForeignKey(
            "referral",
            new TableForeignKey({
                columnNames: ["referrer_customer_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "customer",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("referral");
    }

}
