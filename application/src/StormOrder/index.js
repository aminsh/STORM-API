import {container} from "../di.config";

import {StormOrderRepository} from "./StormOrderRepository";
import {StormPlanRepository} from "./StormPlanRepository";
import {StormOrderService} from "./OrderService";
import {StormGiftRepository} from "./StormGiftRepository";

container.bind("StormOrderRepository").to(StormOrderRepository);
container.bind("StormPlanRepository").to(StormPlanRepository);
container.bind("StormOrderService").to(StormOrderService);
container.bind("StormGiftRepository").to(StormGiftRepository);