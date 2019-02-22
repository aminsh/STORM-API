import { StockRepository } from "./StockRepository";
import { StockQuery } from "./StockQuery";
import { StockService } from "./StockService";
import { InventoryRepository } from "./InventoryRepository";
import { InventoryControlTurnoverService } from "./InventoryControlTurnoverService";
import { InputService } from "./InputService";
import { OutputService } from "./OutputService";
import { InventoryIOTypeRepository } from "./InventoryIOTypeRepository";
import { InventoryService } from "./InventoryService";
import { InventoryIOTypeService } from "./InventoryIOTypeService";
import { InventoryIOTypeQuery } from "./InventoryIOTypeQuery";
import { InventoryQuery } from "./InventoryQuery";

import { InventorySaleEventListener } from "./InventorySaleEventListener";
import { InventoryPurchaseEventListener } from "./InventoryPurchaseEventListener";
import { InventoryReturnSaleEventListener } from "./InventoryReturnSaleEventListener";
import { InventoryReturnPurchaseEventListener } from "./InventoryReturnPurchaseEventListener";
import { InputEventListener } from "./InputEventListener";
import { OutputEventListener } from "./OutputEventListener";

import "./InventoryIOTypeController";
import "./StockController";
import "./InputController";
import "./OutputController";
import "./InventoryController";
import "./InventoryPricingController";
import { InventoryPricingRepository } from "./InventoryPricingRepository";
import { InventoryPricingService } from "./InventoryPricingService";
import { InventoryPricingQuery } from "./InventoryPricingQuery";

export function register(container) {

    container.bind("StockRepository").to(StockRepository);
    container.bind("StockQuery").to(StockQuery);
    container.bind("StockService").to(StockService);

    container.bind("InventoryRepository").to(InventoryRepository);
    container.bind("InventoryQuery").to(InventoryQuery);
    container.bind("InventoryControlTurnoverService").to(InventoryControlTurnoverService);

    container.bind("InputService").to(InputService);
    container.bind("OutputService").to(OutputService);

    container.bind("InventoryIOTypeRepository").to(InventoryIOTypeRepository);
    container.bind("InventoryIOTypeService").to(InventoryIOTypeService);
    container.bind("InventoryIOTypeQuery").to(InventoryIOTypeQuery);

    container.bind("InventoryService").to(InventoryService);

    container.bind("InputEventListener").to(InputEventListener);
    container.bind("OutputEventListener").to(OutputEventListener);
    container.bind("InventorySaleEventListener").to(InventorySaleEventListener);
    container.bind("InventoryPurchaseEventListener").to(InventoryPurchaseEventListener);
    container.bind("InventoryReturnSaleEventListener").to(InventoryReturnSaleEventListener);
    container.bind("InventoryReturnPurchaseEventListener").to(InventoryReturnPurchaseEventListener);

    container.bind("InventoryPricingRepository").to(InventoryPricingRepository);
    container.bind("InventoryPricingQuery").to(InventoryPricingQuery);
    container.bind("InventoryPricingService").to(InventoryPricingService).inTransientScope();

}