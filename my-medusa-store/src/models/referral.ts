import { BaseEntity } from "@medusajs/medusa"
import { Customer } from "@medusajs/medusa/dist/models"
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    OneToOne
} from "typeorm"

@Entity()
export class Referral extends BaseEntity {
    @Column({ type: "varchar" })
    referral_code: string | null

    @OneToOne(() => Customer)
    @JoinColumn({ name: "referrer_customer_id" })
    referrer_customer: Customer

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "referral")
    }
}