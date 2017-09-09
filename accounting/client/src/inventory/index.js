"use strict";

import accModule from '../acc.module';
import StockApi from './stockApi';
import StocksController from './stocks.controller';
import StockEntryController from './stockEntry';
import InventoryController from './inventory.controller';
import InventoryInputsController from './inventoryInputs.controller';

import './inventoryApi';

accModule
    .service('stockApi', StockApi)
    .controller('stocksController', StocksController)
    .controller('stockEntryController', StockEntryController)
    .controller('inventoryController', InventoryController)
    .controller('inventoryInputsController', InventoryInputsController)

