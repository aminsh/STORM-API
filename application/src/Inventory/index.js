import {StockRepository} from "./StockRepository";
import {InventoryRepository} from "./InventoryRepository";
import {InventoryControlTurnoverService} from "./InventoryControlTurnoverService";
import {InputService} from "./InputService";
import {OutputService} from "./OutputService";
import {InventoryIOTypeRepository} from "./InventoryIOTypeRepository";
import {InventoryService} from "./InventoryService";
import {SaleCompareHistoryService} from "./SaleCompareHistoryService";
import {PurchaseCompareHistoryService} from "./PurchaseCompareHistoryService";

import {SaleEventListener} from "./SaleEventListener";
import {PurchaseEventListener} from "./PurchaseEventListener";
import {InputEventListener} from "./InputEventListener";
import {OutputEventListener} from "./OutputEventListener";

export function register(container) {

    container.bind("StockRepository").to(StockRepository);
    container.bind("InventoryRepository").to(InventoryRepository);
    container.bind("InventoryControlTurnoverService").to(InventoryControlTurnoverService);

    container.bind("InputService").to(InputService);
    container.bind("OutputService").to(OutputService);
    container.bind("InventoryIOTypeRepository").to(InventoryIOTypeRepository);

    container.bind("InventoryService").to(InventoryService);

    container.bind("InputEventListener").to(InputEventListener);
    container.bind("OutputEventListener").to(OutputEventListener);
    container.bind("SaleEventListener").to(SaleEventListener);
    container.bind("PurchaseEventListener").to(PurchaseEventListener);

    container.bind("SaleCompareHistoryService").to(SaleCompareHistoryService);
    container.bind("PurchaseCompareHistoryService").to(PurchaseCompareHistoryService);
}