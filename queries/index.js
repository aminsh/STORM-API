"use strict";

module.exports.DetailAccountQuery = require('../accounting/server/queries/query.detailAccount');
module.exports.GeneralLedgerAccountQuery = require('../accounting/server/queries/query.generalLedgerAccount');
module.exports.SubsidiaryLedgerAccountQuery = require('../accounting/server/queries/query.subsidiaryLedgerAccount');
module.exports.JournalQuery = require('../accounting/server/queries/query.journal');

//module.exports.ProductQuery = require('../application/src/Product/ProductQuery');
/*module.exports.ProductCategoryQuery = require('../application/src/Product/ProductCategoryQuery');
module.exports.ScaleQuery = require('../application/src/Product/ScaleQuery');*/
module.exports.StockQuery = require('../accounting/server/queries/query.stock');

module.exports.InventoryQuery = require('../accounting/server/queries/query.inventory');
module.exports.InvoiceQuery = require('../accounting/server/queries/query.invoice');

module.exports.SettingsQuery = require('../accounting/server/queries/query.settings');


