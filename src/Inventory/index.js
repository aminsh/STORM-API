import {StockRepository} from "./StockRepository";
import {StockQuery} from "./StockQuery";
import {StockService} from "./StockService";
import {InventoryRepository} from "./InventoryRepository";
import {InventoryControlTurnoverService} from "./InventoryControlTurnoverService";
import {InputService} from "./InputService";
import {OutputService} from "./OutputService";
import {InventoryIOTypeRepository} from "./InventoryIOTypeRepository";
import {InventoryService} from "./InventoryService";
import {SaleCompareHistoryService} from "./SaleCompareHistoryService";
import {PurchaseCompareHistoryService} from "./PurchaseCompareHistoryService";
import {InventoryIOTypeService} from "./InventoryIOTypeService";
import {InventoryIOTypeQuery} from "./InventoryIOTypeQuery";
import {InventoryQuery} from "./InventoryQuery";

import {InventorySaleEventListener} from "./InventorySaleEventListener";
import {PurchaseEventListener} from "./PurchaseEventListener";
import {InputEventListener} from "./InputEventListener";
import {OutputEventListener} from "./OutputEventListener";

import "./InventoryIOTypeController";
import "./StockController";
import "./InputController";
import "./OutputController";
import "./InventoryController";

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
    container.bind("PurchaseEventListener").to(PurchaseEventListener);

    container.bind("SaleCompareHistoryService").to(SaleCompareHistoryService);
    container.bind("PurchaseCompareHistoryService").to(PurchaseCompareHistoryService);
}