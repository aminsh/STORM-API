import {InventoryAccountingRepository} from "./InventoryAccountingRepository";
import {InventoryAccountingInputEventListener} from "./InventoryAccountingInputEventListener";
import {InventoryAccountingPricingService} from "./InventoryAccountingPricingService";

import "./InventoryAccountingController";

export function register(container) {

    container.bind("InventoryAccountingRepository").to(InventoryAccountingRepository);
    container.bind("InventoryAccountingInputEventListener").to(InventoryAccountingInputEventListener);
    container.bind("InventoryAccountingPricingService").to(InventoryAccountingPricingService);
}