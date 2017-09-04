"use strict";

import accModule from '../acc.module';
import StockApi from './stockApi';
import StocksController from './stocks.controller';
import StockEntryController from './stockEntry';

import './inventoryApi';

accModule
    .service('stockApi', StockApi)
    .controller('stocksController', StocksController)
    .controller('stockEntryController',StockEntryController);

