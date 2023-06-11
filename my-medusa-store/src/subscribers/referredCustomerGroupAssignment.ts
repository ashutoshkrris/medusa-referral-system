import { CustomerGroupService, EventBusService } from "@medusajs/medusa"


type InjectedProperties = {
    eventBusService: EventBusService
    customerGroupService: CustomerGroupService
}


class ReferredCustomerGroupAssignmentSubscriber {
    private customerGroupService: CustomerGroupService
    private customerGroupName: string

    constructor(properties: InjectedProperties) {
        this.customerGroupService = properties.customerGroupService;
        this.customerGroupName = "Referred Customers";
        properties.eventBusService.subscribe("referred-discount.update", this.handleGroupAssignment);
    }

    handleGroupAssignment = async ({ referredCustomerId }) => {

        let customerGroup;

        // Check if "Referred Customers" customer group exists
        let customerGroupList = await this.customerGroupService.list({ name: this.customerGroupName }, { take: 1 });

        // If it doesn't exist, create it
        if (!customerGroupList.length) {
            customerGroup = await this.customerGroupService.create({ name: this.customerGroupName });
        } else {
            customerGroup = customerGroupList[0];
        }

        // Add customer to "Referred Customers" customer group
        await this.customerGroupService.addCustomers(customerGroup.id, [referredCustomerId]);
    }
}

export default ReferredCustomerGroupAssignmentSubscriber;