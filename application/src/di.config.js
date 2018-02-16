import {Container} from "inversify";
import {CommandBus} from "./bus/CommandBus";
import {EventBus} from "./bus/EventBus";
import {EventHandler} from "./bus/EventHandler";

import {
    DetailAccountRepository,
    FiscalPeriodRepository,
    GeneralLedgerAccountRepository,
    InventoryRepository,
    InvoiceRepository,
    JournalGenerationTemplateRepository,
    JournalRepository,
    PaymentRepository,
    ProductCategoryRepository,
    ProductRepository,
    ScaleRepository,
    SettingsRepository,
    StockRepository,
    SubsidiaryLedgerAccountRepository
} from "./domain/data";
import {
    BankDomainService,
    DetailAccountDomainService,
    FiscalPeriodDomainService,
    FundDomainService,
    GeneralLedgerAccountDomainService,
    InputPurchaseDomainService,
    InputReturnInvoiceDomainService,
    InventoryControlDomainService,
    InventoryInputDomainService,
    InventoryOutputDomainService,
    InvoiceDomainService,
    InvoicePurchaseDomainService,
    InvoiceReturnDomainService,
    JournalDomainService,
    JournalGenerationTemplateDomainService,
    PaymentDomainService,
    PersonDomainService,
    ProductCategoryDomainService,
    ProductDomainService,
    ScaleDomainService,
    SettingsDomainService,
    StockDomainService,
    SubsidiaryLedgerAccountDomainService,
    InvoiceInventoryDomainService,
    JournalInvoiceGenerationDomainService
} from "./domain/services";

import {InvoiceEventListener} from "./domain/eventHandlers/InvoiceEventListener";
import {PurchaseEventListener} from "./domain/eventHandlers/PurchaseEventListener";

const container = new Container({ defaultScope: "Request" });

container.bind("CommandBus").to(CommandBus).inRequestScope();
container.bind("EventBus").to(EventBus).inRequestScope();
container.bind("EventHandler").to(EventHandler).inRequestScope();

container.bind("Factory<DomainService>").toFactory(context => {
    return (name) => context.container.get(name);
});

container.bind("Factory<EventHandler>").toFactory(context => {
    return (name) => context.container.get(name);
});

container.bind("DetailAccountRepository").to(DetailAccountRepository).inRequestScope();
container.bind("FiscalPeriodRepository").to(FiscalPeriodRepository).inRequestScope();
container.bind("GeneralLedgerAccountRepository").to(GeneralLedgerAccountRepository).inRequestScope();
container.bind("InventoryRepository").to(InventoryRepository).inRequestScope();
container.bind("InvoiceRepository").to(InvoiceRepository).inRequestScope();
container.bind("JournalRepository").to(JournalRepository).inRequestScope();
container.bind("JournalGenerationTemplateRepository").to(JournalGenerationTemplateRepository).inRequestScope();
container.bind("PaymentRepository").to(PaymentRepository).inRequestScope();
container.bind("ProductRepository").to(ProductRepository).inRequestScope();
container.bind("ProductCategoryRepository").to(ProductCategoryRepository).inRequestScope();
container.bind("ScaleRepository").to(ScaleRepository).inRequestScope();
container.bind("SettingsRepository").to(SettingsRepository).inRequestScope();
container.bind("StockRepository").to(StockRepository).inRequestScope();
container.bind("SubsidiaryLedgerAccountRepository").to(SubsidiaryLedgerAccountRepository).inRequestScope();

container.bind("BankDomainService").to(BankDomainService).inRequestScope();
container.bind("DetailAccountDomainService").to(DetailAccountDomainService).inRequestScope();
container.bind("FiscalPeriodDomainService").to(FiscalPeriodDomainService).inRequestScope();
container.bind("FundDomainService").to(FundDomainService).inRequestScope();
container.bind("GeneralLedgerAccountDomainService").to(GeneralLedgerAccountDomainService).inRequestScope();
container.bind("InputPurchaseDomainService").to(InputPurchaseDomainService).inRequestScope();
container.bind("InputReturnInvoiceDomainService").to(InputReturnInvoiceDomainService).inRequestScope();
container.bind("InventoryControlDomainService").to(InventoryControlDomainService).inRequestScope();
container.bind("InventoryInputDomainService").to(InventoryInputDomainService).inRequestScope();
container.bind("InventoryOutputDomainService").to(InventoryOutputDomainService).inRequestScope();
container.bind("InvoiceDomainService").to(InvoiceDomainService).inRequestScope();
container.bind("InvoicePurchaseDomainService").to(InvoicePurchaseDomainService).inRequestScope();
container.bind("InvoiceReturnDomainService").to(InvoiceReturnDomainService).inRequestScope();
container.bind("JournalDomainService").to(JournalDomainService).inRequestScope();
container.bind("JournalGenerationTemplateDomainService").to(JournalGenerationTemplateDomainService).inRequestScope();
container.bind("PaymentDomainService").to(PaymentDomainService).inRequestScope();
container.bind("PersonDomainService").to(PersonDomainService).inRequestScope();
container.bind("ProductDomainService").to(ProductDomainService).inRequestScope();
container.bind("ProductCategoryDomainService").to(ProductCategoryDomainService).inRequestScope();
container.bind("ScaleDomainService").to(ScaleDomainService).inRequestScope();
container.bind("SettingsDomainService").to(SettingsDomainService).inRequestScope();
container.bind("StockDomainService").to(StockDomainService).inRequestScope();
container.bind("SubsidiaryLedgerAccountDomainService").to(SubsidiaryLedgerAccountDomainService).inRequestScope();
container.bind("InvoiceInventoryDomainService").to(InvoiceInventoryDomainService).inRequestScope();
container.bind("JournalInvoiceGenerationDomainService").to(JournalInvoiceGenerationDomainService).inRequestScope();

container.bind("InvoiceEventListener").to(InvoiceEventListener).inRequestScope();
container.bind("PurchaseEventListener").to(PurchaseEventListener);

export {container};