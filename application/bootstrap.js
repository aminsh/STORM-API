"use strict";

global.ApplicationService = {
    InvoiceService: require('./invoice'),
    DetailAccountService: require('./detailAccount'),
    PersonService: require('./person'),
    BankService: require('./bank'),
    FundService: require('./fund'),
    ProductService: require('./product'),
    ProductCategoryService: require('./productCategory'),
    ScaleService: require('./scale'),
    InventoryOutputService: require('./inventoryOutput'),
    InventoryInputService: require('./inventoryInput'),
    JournalService: require('./journal'),
    PaymentService: require('./payment'),
    GeneralLedgerAccountService: require('./generalLedgerAccount'),
    SubsidiaryLedgerAccountService: require('./subsidiaryLedgerAccount')
};

require('./logger');
