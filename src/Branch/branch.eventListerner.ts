import { Injectable } from "../Infrastructure/DependencyInjection";
import { EventHandler } from "../Infrastructure/EventHandler";
import { OrderCompletedEvent } from "../StormOrder/orderCompleted.event";
import { OrderRepository } from "../StormOrder/order.repository";
import { BranchRepository } from "./branch.repository";
import { BranchStatus } from "./branch.entity";
import { BranchSubscription } from "./branchSubscription.entity";

@Injectable()
export class BranchEventListener {
    constructor(private readonly orderRepository: OrderRepository,
                private readonly branchRepository: BranchRepository) { }

    @EventHandler(OrderCompletedEvent)
    async onOrderCompleted(event: OrderCompletedEvent): Promise<void> {
        const order = await this.orderRepository.findOne({ id : event.orderId }),
            branch = order.branch;

        const isActiveApi = order.plan.features.api && order.plan.features.api.length > 0;

        branch.status = BranchStatus.ACTIVE;

        let endDate;
        if(order.duration && order.duration > 0) {
            endDate = new Date();
            endDate.setMonth(endDate.getMonth() + order.duration);
        }

        let subscription = new BranchSubscription();
        subscription.startDate = new Date();
        subscription.endDate = endDate;
        subscription.plan = order.plan;
        subscription.isActiveApi = isActiveApi;

        branch.subscriptions.push(subscription);

        await this.branchRepository.save(branch);
    }
}