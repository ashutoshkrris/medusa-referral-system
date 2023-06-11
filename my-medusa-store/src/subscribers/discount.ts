import { CustomerGroupService, CustomerService, EventBusService, OrderService } from "@medusajs/medusa"


type InjectedProperties = {
    eventBusService: EventBusService
    customerGroupService: CustomerGroupService
    customerService: CustomerService
    orderService: OrderService
}


class DiscountSubscriber {
    private customerGroupService: CustomerGroupService
    private customerService: CustomerService
    private orderService: OrderService
    private referredCustomerGroupName: string
    private referrerCustomerGroupName: string

    constructor(properties: InjectedProperties) {
        this.customerGroupService = properties.customerGroupService;
        this.customerService = properties.customerService;
        this.orderService = properties.orderService;
        this.referredCustomerGroupName = "Referred Customers";
        this.referrerCustomerGroupName = "Referrer Customers";

        properties.eventBusService.subscribe("order.placed", this.handleDiscounts);
    }

    handleDiscounts = async ({ id }) => {

        // Retrieve the order by id
        const order = await this.orderService.retrieve(id, { relations: ["discounts"] });

        // Get the code used by the customer
        const discountCodeUsed = order.discounts && order.discounts[0].code;

        // Get the customer
        const customer = await this.customerService.retrieve(order.customer_id, { relations: ["groups"] });

        if (discountCodeUsed === "NEW10") {
            const customerGroup = customer.groups.find(group => group.name === this.referredCustomerGroupName);
            await this.customerGroupService.removeCustomer(customerGroup.id, [customer.id]);
        } else if (discountCodeUsed === "REFER20") {
            const totalReferrals = customer.metadata.total_referrals as number;

            if (totalReferrals == 1) {
                await this.customerService.update(customer.id, {
                    metadata: { "total_referrals": 0 }
                })
                const customerGroup = customer.groups.find(group => group.name === this.referrerCustomerGroupName);
                await this.customerGroupService.removeCustomer(customerGroup.id, [customer.id]);
            } else if (totalReferrals > 1) {
                await this.customerService.update(customer.id, {
                    metadata: { "total_referrals": totalReferrals - 1 }
                })
            }
        }
    }
}

export default DiscountSubscriber;