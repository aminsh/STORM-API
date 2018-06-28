import {StormOrderRepository} from "./StormOrderRepository";
import {StormPlanRepository} from "./StormPlanRepository";
import {StormOrderService} from "./OrderService";
import {StormGiftRepository} from "./StormGiftRepository";
import {GiftQuery} from "./GiftQuery";
import {PlanQuery} from "./PlanQuery";
import {OrderQuery} from "./OrderQuery";

import "./GiftController";
import "./PlanController";
import "./OrderController";

export function register(container) {

    container.bind("StormOrderRepository").to(StormOrderRepository);
    container.bind("StormPlanRepository").to(StormPlanRepository);
    container.bind("StormOrderService").to(StormOrderService);
    container.bind("StormGiftRepository").to(StormGiftRepository);
    container.bind("GiftQuery").to(GiftQuery);
    container.bind("PlanQuery").to(PlanQuery);
    container.bind("OrderQuery").to(OrderQuery);
}



