import { TransactionBaseService } from "@medusajs/medusa"
import { Referral } from "models/referral"
import { EntityManager } from "typeorm"
import { CreateReferralInput } from "types/referral"
import ReferralRepository from "../repositories/referral"

type InjectedDependencies = {
    manager: EntityManager
    referralRepository: typeof ReferralRepository
}

class ReferralService extends TransactionBaseService {
    protected readonly referralRepository_: typeof ReferralRepository

    constructor({
        referralRepository
    }: InjectedDependencies) {
        super(arguments[0])
        this.referralRepository_ = referralRepository
    }

    async create(referral: CreateReferralInput): Promise<Referral> {
        return await this.atomicPhase_(async (manager) => {
            const referralRepository = manager.withRepository(
                this.referralRepository_
            )
            const created = referralRepository.create(referral);
            const result = await referralRepository.save(created);

            return result;
        })
    }

    async getByCode(referralCode: string): Promise<Referral> {

        return await this.atomicPhase_(async (manager) => {
            const referralRepository = manager.withRepository(
                this.referralRepository_
            )
            const referral = await referralRepository
                .createQueryBuilder("referral")
                .leftJoinAndSelect("referral.referrer_customer", "referrer_customer")
                .where("referral.referral_code = :referralCode", { referralCode })
                .getOne();

            return referral;
        })
    }

}

export default ReferralService