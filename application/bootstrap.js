"use strict";

global.ApplicationService = {
    InvoiceService: require('./invoice'),
    DetailAccountService: require('./detailAccount'),
    ProductService: require('./product'),
    InventoryOutputService: require('./inventoryOutput'),
    JournalService: require('./journal')
};

require('./logger');
