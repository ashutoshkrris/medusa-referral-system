import { CustomerService, EventBusService } from "@medusajs/medusa";
import ReferralService from "../services/referral";

type InjectedProperties = {
    eventBusService: EventBusService
    referralService: ReferralService
    customerService: CustomerService
}

class NewReferralCodeSubscriber {
    private referralService: ReferralService
    private customerService: CustomerService

    constructor(properties: InjectedProperties) {
        this.referralService = properties.referralService;
        this.customerService = properties.customerService;
        properties.eventBusService.subscribe("customer.created", this.assignNewReferralCode);
    }

    assignNewReferralCode = async (customer) => {

        // Generate new referral code
        let newReferralCode = this.generateReferralCode(6);

        await this.referralService.create({
            referral_code: newReferralCode,
            referrer_customer: customer
        })

        await this.customerService.update(customer.id, {
            metadata: { "referral_code": newReferralCode }
        })
    }

    generateReferralCode = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const codeLength = length || 6;
        let referralCode = '';

        while (referralCode.length < codeLength) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            const randomCharacter = characters.charAt(randomIndex);
            referralCode += randomCharacter;
        }

        return referralCode;
    }
}

export default NewReferralCodeSubscriber;