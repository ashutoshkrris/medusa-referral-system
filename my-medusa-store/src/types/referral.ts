import { Customer } from "@medusajs/medusa/dist/models/customer"

export type CreateReferralInput = {
    referral_code?: string
    referrer_customer?: Customer
}