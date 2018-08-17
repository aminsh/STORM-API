import {Container} from "inversify";
import {CommandBus} from "./bus/CommandBus";
import {EventBus} from "./bus/EventBus";
import {UserEventHandler} from "./bus/EventHandler";
import {HttpRequest} from "./core/HttpRequest";
import {UnitOfWork} from "./core/UnitOfWork";

import {

    PaymentRepository,
    PermissionRepository
} from "./domain/data";
import {
    InputPurchaseDomainService,
    InputReturnInvoiceDomainService,
    InventoryInputDomainService,
    InventoryOutputDomainService,
    InvoiceDomainService,
    InvoiceReturnDomainService,
    JournalDomainService,
    InvoiceInventoryDomainService,
    JournalInvoiceGenerationDomainService,
    ReturnPurchaseDomainService,
    OutputReturnPurchaseDomainService,

    InventoryAccountingDomainService,
    PermissionDomainService,
    UserPermissionsControlDomainService
} from "./domain/services";

/*import {InvoiceEventListener} from "./domain/eventHandlers/InvoiceEventListener";
import {ReturnPurchaseEventListener} from "./domain/eventHandlers/ReturnPurchaseEventListener";
import {ReturnSaleEventListener} from "./domain/eventHandlers/ReturnSaleEventListener";*/
import {TreasuryEventListener} from "./domain/eventHandlers/TreasuryEventListener";

const container = new Container({defaultScope: "Request"});

container.bind("CommandBus").to(CommandBus).inRequestScope();
container.bind("EventBus").to(EventBus).inRequestScope();
container.bind("UserEventHandler").to(UserEventHandler).inRequestScope();
container.bind("UnitOfWork").to(UnitOfWork).inTransientScope();
container.bind("HttpRequest").to(HttpRequest).inSingletonScope();

container.bind("Factory<Repository>").toFactory(context => {
    return (name) => context.container.get(name);
});

container.bind("Factory<DomainService>").toFactory(context => {
    return (name) => context.container.get(name);
});

container.bind("Factory<EventHandler>").toFactory(context => {
    return (name) => context.container.get(name);
});


container.bind("PaymentRepository").to(PaymentRepository).inRequestScope();
container.bind("PermissionRepository").to(PermissionRepository).inRequestScope();

container.bind("InputPurchaseDomainService").to(InputPurchaseDomainService).inRequestScope();
container.bind("InputReturnInvoiceDomainService").to(InputReturnInvoiceDomainService).inRequestScope();
container.bind("InventoryInputDomainService").to(InventoryInputDomainService).inRequestScope();
container.bind("InventoryOutputDomainService").to(InventoryOutputDomainService).inRequestScope();
container.bind("InvoiceDomainService").to(InvoiceDomainService).inRequestScope();
container.bind("InvoiceReturnDomainService").to(InvoiceReturnDomainService).inRequestScope();
container.bind("JournalDomainService").to(JournalDomainService).inRequestScope();
container.bind("InvoiceInventoryDomainService").to(InvoiceInventoryDomainService).inRequestScope();
container.bind("JournalInvoiceGenerationDomainService").to(JournalInvoiceGenerationDomainService).inRequestScope();
container.bind("ReturnPurchaseDomainService").to(ReturnPurchaseDomainService).inRequestScope();
container.bind("OutputReturnPurchaseDomainService").to(OutputReturnPurchaseDomainService).inRequestScope();
container.bind("InventoryAccountingDomainService").to(InventoryAccountingDomainService).inRequestScope();
container.bind("PermissionDomainService").to(PermissionDomainService).inRequestScope();
container.bind("UserPermissionsControlDomainService").to(UserPermissionsControlDomainService).inRequestScope();


container.bind("TreasuryEventListener").to(TreasuryEventListener);

export {container};