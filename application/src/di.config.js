import {Container} from "inversify";
import {CommandBus} from "./bus/CommandBus";
import {EventBus} from "./bus/EventBus";
import {UserEventHandler} from "./bus/EventHandler";
import {HttpRequest} from "./core/HttpRequest";
import {UnitOfWork} from "./core/UnitOfWork";

import {

    JournalGenerationTemplateRepository,
    JournalRepository,
    PaymentRepository,
    TreasuryRepository,
    BanksNameRepository,
    TreasurySettingRepository,
    ChequeCategoryRepository,
    TreasuryPurposeRepository,
    DimensionCategoryRepository,
    DimensionRepository,
    VerificationRepository,
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
    JournalGenerationTemplateDomainService,
    PaymentDomainService,
    PersonDomainService,
    ProductCategoryDomainService,
    ScaleDomainService,
    SettingsDomainService,
    InvoiceInventoryDomainService,
    JournalInvoiceGenerationDomainService,
    ReturnPurchaseDomainService,
    OutputReturnPurchaseDomainService,
    BanksNameDomainService,
    PayableChequeCategoryDomainService,
    PayableChequeDomainService,
    TreasuryChequeDomainService,
    TreasuryCashDomainService,
    TreasuryReceiptDomainService,
    TreasuryDemandNoteDomainService,
    TreasuryJournalGenerationDomainService,
    TreasuryTransferDomainService,
    TreasuryPurposeDomainService,
    TreasuryDomainService,
    InventoryAccountingDomainService,
    InventoryDomainService,
    VerificationDomainService,
    PermissionDomainService,
    UserPermissionsControlDomainService,
    TreasurySettingDomainService
} from "./domain/services";

/*import {InvoiceEventListener} from "./domain/eventHandlers/InvoiceEventListener";
import {ReturnPurchaseEventListener} from "./domain/eventHandlers/ReturnPurchaseEventListener";
import {ReturnSaleEventListener} from "./domain/eventHandlers/ReturnSaleEventListener";*/
import {TreasuryEventListener} from "./domain/eventHandlers/TreasuryEventListener";
import {ChequeEventListener} from "./domain/eventHandlers/ChequeEventListener";

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


container.bind("JournalRepository").to(JournalRepository).inRequestScope();
container.bind("JournalGenerationTemplateRepository").to(JournalGenerationTemplateRepository).inRequestScope();
container.bind("PaymentRepository").to(PaymentRepository).inRequestScope();
container.bind("TreasuryRepository").to(TreasuryRepository).inRequestScope();
container.bind("BanksNameRepository").to(BanksNameRepository).inRequestScope();
container.bind("TreasurySettingRepository").to(TreasurySettingRepository).inRequestScope();
container.bind("ChequeCategoryRepository").to(ChequeCategoryRepository).inRequestScope();
container.bind("TreasuryPurposeRepository").to(TreasuryPurposeRepository).inRequestScope();
container.bind("PermissionRepository").to(PermissionRepository).inRequestScope();

container.bind("InputPurchaseDomainService").to(InputPurchaseDomainService).inRequestScope();
container.bind("InputReturnInvoiceDomainService").to(InputReturnInvoiceDomainService).inRequestScope();
container.bind("InventoryInputDomainService").to(InventoryInputDomainService).inRequestScope();
container.bind("InventoryOutputDomainService").to(InventoryOutputDomainService).inRequestScope();
container.bind("InvoiceDomainService").to(InvoiceDomainService).inRequestScope();
container.bind("InvoiceReturnDomainService").to(InvoiceReturnDomainService).inRequestScope();
container.bind("JournalDomainService").to(JournalDomainService).inRequestScope();
container.bind("JournalGenerationTemplateDomainService").to(JournalGenerationTemplateDomainService).inRequestScope();
container.bind("InvoiceInventoryDomainService").to(InvoiceInventoryDomainService).inRequestScope();
container.bind("JournalInvoiceGenerationDomainService").to(JournalInvoiceGenerationDomainService).inRequestScope();
container.bind("ReturnPurchaseDomainService").to(ReturnPurchaseDomainService).inRequestScope();
container.bind("OutputReturnPurchaseDomainService").to(OutputReturnPurchaseDomainService).inRequestScope();
container.bind("TreasuryChequeDomainService").to(TreasuryChequeDomainService).inRequestScope();
container.bind("TreasuryCashDomainService").to(TreasuryCashDomainService).inRequestScope();
container.bind("TreasuryReceiptDomainService").to(TreasuryReceiptDomainService).inRequestScope();
container.bind("TreasuryDemandNoteDomainService").to(TreasuryDemandNoteDomainService).inRequestScope();
container.bind("PayableChequeCategoryDomainService").to(PayableChequeCategoryDomainService).inRequestScope();
container.bind("PayableChequeDomainService").to(PayableChequeDomainService).inRequestScope();
container.bind("TreasuryJournalGenerationDomainService").to(TreasuryJournalGenerationDomainService).inRequestScope();
container.bind("TreasuryTransferDomainService").to(TreasuryTransferDomainService).inRequestScope();
container.bind("TreasuryPurposeDomainService").to(TreasuryPurposeDomainService).inRequestScope();
container.bind("TreasuryDomainService").to(TreasuryDomainService).inRequestScope();
container.bind("TreasurySettingDomainService").to(TreasurySettingDomainService).inRequestScope();
container.bind("InventoryAccountingDomainService").to(InventoryAccountingDomainService).inRequestScope();
container.bind("PermissionDomainService").to(PermissionDomainService).inRequestScope();
container.bind("UserPermissionsControlDomainService").to(UserPermissionsControlDomainService).inRequestScope();


container.bind("TreasuryEventListener").to(TreasuryEventListener);
container.bind("ChequeEventListener").to(ChequeEventListener);

container.bind("PaypingInterfacePaymentGateway").to(PaypingInterfacePaymentGateway).inSingletonScope();
container.bind("ZarinpalInterfacePaymentGateway").to(ZarinpalInterfacePaymentGateway).inSingletonScope();

export {container};