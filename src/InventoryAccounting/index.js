import {InventoryAccountingRepository} from "./InventoryAccountingRepository";
import {InventoryAccountingInputEventListener} from "./InventoryAccountingInputEventListener";
import {InventoryAccountingPricingService} from "./InventoryAccountingPricingService";
import {InventoryAccountingQuery} from "./InventoryAccountingQuery";

import "./InventoryAccountingController";

export function register(container) {

    container.bind("InventoryAccountingRepository").to(InventoryAccountingRepository);
    container.bind("InventoryAccountingInputEventListener").to(InventoryAccountingInputEventListener);
    container.bind("InventoryAccountingPricingService").to(InventoryAccountingPricingService);

    container.bind("InventoryAccountingQuery").to(InventoryAccountingQuery);
}