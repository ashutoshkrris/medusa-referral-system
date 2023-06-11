import { Router } from "express"
import { getConfigFile, parseCorsOrigins } from "medusa-core-utils";
import { ConfigModule } from "@medusajs/medusa/dist/types/global";
import cors from "cors";
const bodyParser = require("body-parser")


export default (rootDirectory: string): Router | Router[] => {

  const { configModule } =
    getConfigFile<ConfigModule>(rootDirectory, "medusa-config")
  const { projectConfig } = configModule

  const corsOptions = {
    origin: projectConfig.store_cors.split(","),
    credentials: true,
  };

  const router = Router()
  router.use(bodyParser.json());

  // add your custom routes here

  router.options("/store/referral/:referralCode", cors(corsOptions))
  router.get("/store/referral/:referralCode", cors(corsOptions),
    async (req, res) => {
      try {
        const referralService = req.scope.resolve("referralService");

        const referralCode = req.params.referralCode;

        const referral = await referralService.getByCode(referralCode);

        if (referral) {
          res.json(referral);
        } else {
          res.status(404).json({ error: "Referral not found" })
        }
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  )

  router.options("/store/referral/discounts", cors(corsOptions))
  router.post("/store/referral/discounts", cors(corsOptions),
    async (req, res) => {
      try {
        const eventBusService = req.scope.resolve("eventBusService");
        const customerService = req.scope.resolve("customerService");

        const { referredCustomerId, referrerCustomerId } = req.body;

        if (referrerCustomerId) {
          eventBusService.emit("referred-discount.update", { referredCustomerId });
          eventBusService.emit("referrer-discount.update", { referrerCustomerId });
          const referrerCustomer = await customerService.retrieve(referrerCustomerId)

          const totalReferrals = referrerCustomer.metadata
            && typeof referrerCustomer.metadata.total_referrals === "number"
            ? referrerCustomer.metadata.total_referrals
            : 0;

          await customerService.update(referrerCustomerId, {
            metadata: {
              "total_referrals": totalReferrals + 1
            }
          })
        }
        res.json({ success: true });
      } catch (error) {
        console.log(error);

        res.status(500).json({ error: "Internal server error" });
      }
    }
  )

  return router;
}
