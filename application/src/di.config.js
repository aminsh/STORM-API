import {Container} from "inversify";
import {CommandBus} from "./bus/CommandBus";
import {EventBus} from "./bus/EventBus";
import {UserEventHandler} from "./bus/EventHandler";
import {HttpRequest} from "./core/HttpRequest";
import {UnitOfWork} from "./core/UnitOfWork";

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
    SubsidiaryLedgerAccountRepository,
    InventoryIOTypeRepository,
    TreasuryRepository,
    BanksNameRepository,
    TreasurySettingRepository,
    ChequeCategoryRepository,
    TreasuryPurposeRepository,
    DimensionCategoryRepository,
    DimensionRepository,
    RegisteredThirdPartyRepository,
    VerificationRepository,
    PermissionRepository
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
    JournalInvoiceGenerationDomainService,
    ReturnPurchaseDomainService,
    OutputReturnPurchaseDomainService,
    InventoryIOTypeDomainService,
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
    PurchaseDomainService,
    InventoryAccountingDomainService,
    InventoryDomainService,
    DimensionDomainService,
    RegisteredThirdPartyDomainService,
    VerificationDomainService,
    PermissionDomainService,
    UserPermissionsControlDomainService,
    TreasurySettingDomainService,
    SettingDomainService
} from "./domain/services";

import {InvoiceEventListener} from "./domain/eventHandlers/InvoiceEventListener";
import {PurchaseEventListener} from "./domain/eventHandlers/PurchaseEventListener";
import {ReturnPurchaseEventListener} from "./domain/eventHandlers/ReturnPurchaseEventListener";
import {ReturnSaleEventListener} from "./domain/eventHandlers/ReturnSaleEventListener";
import {TreasuryEventListener} from "./domain/eventHandlers/TreasuryEventListener";
import {ChequeEventListener} from "./domain/eventHandlers/ChequeEventListener";

import {PaypingInterfacePaymentGateway} from "./integration/paymentGateway/payping/PaypingInterfacePaymentGateway";
import {ZarinpalInterfacePaymentGateway} from "./integration/paymentGateway/zarinpal/ZarinpalInterfacePaymentGateway";
import {KaveNegarSmsService} from "./integration/smsService/KaveNegar"

const container = new Container({defaultScope: "Request"});

container.bind("CommandBus").to(CommandBus).inRequestScope();
container.bind("EventBus").to(EventBus).inRequestScope();
container.bind("UserEventHandler").to(UserEventHandler).inRequestScope();
container.bind("UnitOfWork").to(UnitOfWork).inTransientScope();
container.bind("HttpRequest").to(HttpRequest).inSingletonScope();
container.bind("SmsService").to(KaveNegarSmsService).inSingletonScope();

container.bind("Factory<Repository>").toFactory(context => {
    return (name) => context.container.get(name);
});

container.bind("Factory<DomainService>").toFactory(context => {
    return (name) => context.container.get(name);
});

container.bind("Factory<EventHandler>").toFactory(context => {
    return (name) => context.container.get(name);
});

container.bind("Factory<ThirdParty>").toFactory(context => {
    return key => {
        if (key === 'payping')
            return context.container.get("PaypingInterfacePaymentGateway");

        if(key === 'zarinpal')
            return context.container.get("ZarinpalInterfacePaymentGateway");
    };
});

container.bind("Factory<PaymentGateway>").toFactory(context => {
    return key => {
        if (key === 'payping')
            return context.container.get("PaypingInterfacePaymentGateway");

        if(key === 'zarinpal')
            return context.container.get("ZarinpalInterfacePaymentGateway");
    };
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
container.bind("InventoryIOTypeRepository").to(InventoryIOTypeRepository).inRequestScope();
container.bind("TreasuryRepository").to(TreasuryRepository).inRequestScope();
container.bind("BanksNameRepository").to(BanksNameRepository).inRequestScope();
container.bind("TreasurySettingRepository").to(TreasurySettingRepository).inRequestScope();
container.bind("ChequeCategoryRepository").to(ChequeCategoryRepository).inRequestScope();
container.bind("TreasuryPurposeRepository").to(TreasuryPurposeRepository).inRequestScope();
container.bind("RegisteredThirdPartyRepository").to(RegisteredThirdPartyRepository).inRequestScope();
container.bind("DimensionCategoryRepository").to(DimensionCategoryRepository).inRequestScope();
container.bind("DimensionRepository").to(DimensionRepository).inRequestScope();
container.bind("VerificationRepository").to(VerificationRepository).inSingletonScope();
container.bind("PermissionRepository").to(PermissionRepository).inRequestScope();

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
container.bind("ReturnPurchaseDomainService").to(ReturnPurchaseDomainService).inRequestScope();
container.bind("OutputReturnPurchaseDomainService").to(OutputReturnPurchaseDomainService).inRequestScope();
container.bind("InventoryIOTypeDomainService").to(InventoryIOTypeDomainService).inRequestScope();
container.bind("TreasuryChequeDomainService").to(TreasuryChequeDomainService).inRequestScope();
container.bind("TreasuryCashDomainService").to(TreasuryCashDomainService).inRequestScope();
container.bind("TreasuryReceiptDomainService").to(TreasuryReceiptDomainService).inRequestScope();
container.bind("TreasuryDemandNoteDomainService").to(TreasuryDemandNoteDomainService).inRequestScope();
container.bind("BanksNameDomainService").to(BanksNameDomainService).inRequestScope();
container.bind("PayableChequeCategoryDomainService").to(PayableChequeCategoryDomainService).inRequestScope();
container.bind("PayableChequeDomainService").to(PayableChequeDomainService).inRequestScope();
container.bind("TreasuryJournalGenerationDomainService").to(TreasuryJournalGenerationDomainService).inRequestScope();
container.bind("TreasuryTransferDomainService").to(TreasuryTransferDomainService).inRequestScope();
container.bind("TreasuryPurposeDomainService").to(TreasuryPurposeDomainService).inRequestScope();
container.bind("PurchaseDomainService").to(PurchaseDomainService).inRequestScope();
container.bind("TreasuryDomainService").to(TreasuryDomainService).inRequestScope();
container.bind("TreasurySettingDomainService").to(TreasurySettingDomainService).inRequestScope();
container.bind("InventoryAccountingDomainService").to(InventoryAccountingDomainService).inRequestScope();
container.bind("InventoryDomainService").to(InventoryDomainService).inRequestScope();
container.bind("RegisteredThirdPartyDomainService").to(RegisteredThirdPartyDomainService).inRequestScope();
container.bind("DimensionDomainService").to(DimensionDomainService).inRequestScope();
container.bind("VerificationDomainService").to(VerificationDomainService).inSingletonScope();
container.bind("PermissionDomainService").to(PermissionDomainService).inRequestScope();
container.bind("UserPermissionsControlDomainService").to(UserPermissionsControlDomainService).inRequestScope();
container.bind("SettingDomainService").to(SettingDomainService).inRequestScope();

container.bind("InvoiceEventListener").to(InvoiceEventListener).inRequestScope();
container.bind("PurchaseEventListener").to(PurchaseEventListener);
container.bind("ReturnPurchaseEventListener").to(ReturnPurchaseEventListener);
container.bind("ReturnSaleEventListener").to(ReturnSaleEventListener);
container.bind("TreasuryEventListener").to(TreasuryEventListener);
container.bind("ChequeEventListener").to(ChequeEventListener);

container.bind("PaypingInterfacePaymentGateway").to(PaypingInterfacePaymentGateway).inSingletonScope();
container.bind("ZarinpalInterfacePaymentGateway").to(ZarinpalInterfacePaymentGateway).inSingletonScope();

export {container};