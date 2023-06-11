import { CustomerGroupService, EventBusService } from "@medusajs/medusa"


type InjectedProperties = {
    eventBusService: EventBusService
    customerGroupService: CustomerGroupService
}


class ReferrerCustomerGroupAssignmentSubscriber {
    private customerGroupService: CustomerGroupService
    private customerGroupName: string

    constructor(properties: InjectedProperties) {
        this.customerGroupService = properties.customerGroupService;
        this.customerGroupName = "Referrer Customers";
        properties.eventBusService.subscribe("referrer-discount.update", this.handleGroupAssignment);
    }

    handleGroupAssignment = async ({ referrerCustomerId }) => {

        let customerGroup;

        // Check if "Referrer Customers" customer group exists
        let customerGroupList = await this.customerGroupService.list({ name: this.customerGroupName }, { take: 1 });

        // If it doesn't exist, create it
        if (!customerGroupList.length) {
            customerGroup = await this.customerGroupService.create({ name: this.customerGroupName });
        } else {
            customerGroup = customerGroupList[0];
        }

        customerGroup = await this.customerGroupService.retrieve(customerGroup.id, { relations: ["customers"] })

        const isCustomerInGroup = customerGroup.customers.some(
            (customer) => customer.id === referrerCustomerId
        );

        if (isCustomerInGroup) return;

        // Add customer to "Referrer Customers" customer group
        await this.customerGroupService.addCustomers(customerGroup.id, [referrerCustomerId]);
    }
}

export default ReferrerCustomerGroupAssignmentSubscriber;