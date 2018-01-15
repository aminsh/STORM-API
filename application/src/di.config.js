import {Container} from "inversify";
import {CommandBus} from "./bus/CommandBus";
import {EventBus} from "./bus/EventBus";
import {EventHandler} from "./bus/EventHandler";

//import {GenericRepository} from "./domain/data/GenericRepository";

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
    SubsidiaryLedgerAccountDomainService
} from "./domain/services";

import {InvoiceEventListener} from "./domain/eventHandlers/InvoiceEventListener";

const container = new Container();

container.bind("CommandBus").to(CommandBus).inRequestScope();
container.bind("EventBus").to(EventBus).inRequestScope();
container.bind("EventHandler").to(EventHandler).inRequestScope();

container.bind("Factory<DomainService>").toFactory(context => {
    return (name) => context.container.get(name);
});

container.bind("Factory<EventHandler>").toFactory(context => {
    return (name) => context.container.get(name);
});
//container.bind("GenericRepository").to(GenericRepository).inRequestScope();

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

container.bind("BankDomainService").to(BankDomainService);
container.bind("DetailAccountDomainService").to(DetailAccountDomainService);
container.bind("FiscalPeriodDomainService").to(FiscalPeriodDomainService);
container.bind("FundDomainService").to(FundDomainService);
container.bind("GeneralLedgerAccountDomainService").to(GeneralLedgerAccountDomainService);
container.bind("InputPurchaseDomainService").to(InputPurchaseDomainService);
container.bind("InputReturnInvoiceDomainService").to(InputReturnInvoiceDomainService);
container.bind("InventoryControlDomainService").to(InventoryControlDomainService);
container.bind("InventoryInputDomainService").to(InventoryInputDomainService);
container.bind("InventoryOutputDomainService").to(InventoryOutputDomainService);
container.bind("InvoiceDomainService").to(InvoiceDomainService);
container.bind("InvoicePurchaseDomainService").to(InvoicePurchaseDomainService);
container.bind("InvoiceReturnDomainService").to(InvoiceReturnDomainService);
container.bind("JournalDomainService").to(JournalDomainService);
container.bind("JournalGenerationTemplateDomainService").to(JournalGenerationTemplateDomainService);
container.bind("PaymentDomainService").to(PaymentDomainService);
container.bind("PersonDomainService").to(PersonDomainService);
container.bind("ProductDomainService").to(ProductDomainService);
container.bind("ProductCategoryDomainService").to(ProductCategoryDomainService);
container.bind("ScaleDomainService").to(ScaleDomainService);
container.bind("SettingsDomainService").to(SettingsDomainService);
container.bind("StockDomainService").to(StockDomainService);
container.bind("SubsidiaryLedgerAccountDomainService").to(SubsidiaryLedgerAccountDomainService);


container.bind("InvoiceEventListener").to(InvoiceEventListener).inRequestScope();

export {container};