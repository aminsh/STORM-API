import {injectable, inject} from "inversify";
import {eventHandler} from "../Infrastructure/@decorators";

@injectable()
export class BranchEventListener {

    @inject("BranchRepository")
    /** @type {BranchRepository}*/ branchRepository = undefined;

    @inject("BranchSubscriptionRepository")
    /** @type {BranchSubscriptionRepository}*/ branchSubscriptionRepository = undefined;

    @inject("StormOrderRepository")
    /** @type {StormOrderRepository} */ orderRepository = undefined;

    @eventHandler("ActivateBranch")
    onActivatingBranch(orderId) {

        let order = this.orderRepository.findById(orderId),
            branchId = order.branchId,
            plan = order.plan;

        let isActiveApi = plan.features.api && plan.features.api.length > 0;

        this.branchRepository.update(branchId, {status: 'active'});

        let endDate;

        if (order.duration && order.duration > 0) {
            endDate = new Date;

            endDate.setMonth(endDate.getMonth() + parseInt(order.duration));
        }

        let subscriptions = {
            startDate: new Date,
            endDate,
            planId: plan.id,
            branchId: branchId,
            isActiveApi
        };

        this.branchSubscriptionRepository.create(subscriptions);

    }
}
