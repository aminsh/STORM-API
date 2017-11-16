"use strict";

global.ApplicationService = {
    InvoiceService: require('./invoice'),
    DetailAccountService: require('./detailAccount'),
    PersonService : require('./person'),
    BankService: require('./bank'),
    FundService: require('./fund'),
    ProductService: require('./product'),
    InventoryOutputService: require('./inventoryOutput'),
    JournalService: require('./journal'),
    PaymentService: require('./payment')
};

require('./logger');
