"use strict";

require('./events/onUserCreated');
require('./events/onSaleCreated.generateJournal');
require('./events/onPurchaseCreated.generateJournal');
require('./events/onPurchaseCreated.generateInput');
require('./events/onSaleCreated.generateOutput');
require('./events/onOutputCreated.generateJournal');
require('./events/onReturnSaleCreated.generateInput');

require('./events/onInvoicePaid');
require('./events/onPaymentCreated');
require('./events/onReceivableChequePassed');
require('./events/onReceivableChequeReturn');
require('./events/onPayableChequePassed');
require('./events/onPayableChequeReturn');
require('./events/onIcomeCreated');
require('./events/onExpenseCreated');
require('./events/onBranchRemoved');