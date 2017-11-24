"use strict";

require('./events/event.onInvoiceCreatedOrChanged');

const EventEmitter = instanceOf('EventEmitter'),
    Guid = instanceOf('utility').Guid,

    servicesConfig = require('./config.services.json');

let ApplicationService = {
    FiscalPeriodService: require('./fiscalPeriod'),
    InvoiceService: require('./invoice'),
    InvoicePurchaseService: require('./invoice.purchase'),
    DetailAccountService: require('./detailAccount'),
    PersonService: require('./person'),
    BankService: require('./bank'),
    FundService: require('./fund'),
    ProductService: require('./product'),
    ProductCategoryService: require('./productCategory'),
    StockService: require('./stock'),
    ScaleService: require('./scale'),
    InventoryOutputService: require('./inventoryOutput'),
    InventoryInputService: require('./inventoryInput'),
    InputPurchaseService: require('./inputPurchase'),
    JournalService: require('./journal'),
    PaymentService: require('./payment'),
    GeneralLedgerAccountService: require('./generalLedgerAccount'),
    SubsidiaryLedgerAccountService: require('./subsidiaryLedgerAccount')
};

global.ApplicationService = ApplicationService;
global.RunService = RunService;


require('./logger');


/**
 * @param {string} serviceName The service name in application.
 * @param {Array} parameters The array of parameters.
 * @param {Object} state The array of parameters.
 * @return {string}
 */

function RunService(serviceName, parameters, state) {

    const serviceId = Guid.new(),
        service = servicesConfig.asEnumerable().single(service => service.name === serviceName),
        stateAsArguments = [state.branchId, state.fiscalPeriodId, state.user],
        Type = ApplicationService[service.class],
        command = {};

    for (let i = 0; i <= service.params.length; i++) {
        command[service.params[i]] = parameters[i];
    }

    EventEmitter.emit('onServiceStarted', serviceId, {command, state, service: serviceName});

    try {
        let instance = new Type(...stateAsArguments),
            result = instance[service.method](...parameters);

        EventEmitter.emit('onServiceSucceed', serviceId, result);

        return result;
    }
    catch (e) {

        if (e instanceof ValidationException) {
            EventEmitter.emit('onServiceInvalid', serviceId, e);

            throw new ValidationException(e.errors);
        }
        else {
            EventEmitter.emit('onServiceFailed', serviceId, e);
            throw new ValidationException(['internal error']);
        }
    }
}
