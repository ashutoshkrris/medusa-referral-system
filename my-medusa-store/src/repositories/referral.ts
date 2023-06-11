import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { Referral } from "../models/referral";

export const ReferralRepository = dataSource
    .getRepository(Referral);

export default ReferralRepository;