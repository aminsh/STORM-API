import {inject, injectable, postConstruct} from "inversify";
import {TreasurySettingRepository} from "../data/repository.treasury.setting";

@injectable()
export class SubsidiaryLedgerAccountDomainService {
        
    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {TreasurySettingRepository}*/
    @inject("TreasurySettingRepository") treasurySettingRepository = undefined;

    /**@type {SubsidiaryLedgerAccountRepository}*/
    @inject("SubsidiaryLedgerAccountRepository") subsidiaryLedgerAccountRepository = undefined;

    /**@type {GeneralLedgerAccountRepository}*/
    @inject("GeneralLedgerAccountRepository") generalLedgerAccountRepository = undefined;

    defaultAccounts = undefined;
    treasuryAccounts = undefined;
    
    @postConstruct()
    init(){
        const settings =  this.settings = this.settingsRepository.get(),
            treasurySettings = this.treasurySettings = this.treasurySettingRepository.get();

        this.defaultAccounts = (settings.subsidiaryLedgerAccounts || [])
            .asEnumerable()
            .toObject(item => item.key, item => item.id);

        this.treasuryAccounts = (treasurySettings.subsidiaryLedgerAccounts || [])
            .asEnumerable()
            .toObject(item => item.key, item => item.id);
    }

    get receivableAccount() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['businessDebtors']);
    }

    get payableAccount() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['businessCreditors']);
    }

    get saleAccount() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['saleGood']);
    }

    get saleDiscountAccount() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['saleDiscountGood']);
    }

    get saleVatAccount() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['saleTax']);
    }

    get purchaseAccount() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['inventory']);
    }

    get purchaseDiscountAccount() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['purchaseDiscountGood']);
    }

    get purchaseVatAccount() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['purchaseTax']);
    }

    get fundAccount() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['fund']);
    }

    get bankAccount() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['bank']);
    }

    get receivableDocument() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['businessNotesReceivables']);
    }

    get payableDocument() {
        return this.subsidiaryLedgerAccountRepository.findById(this.defaultAccounts['businessNotesPayables']);
    }


    get treasuryDebtors() {
        return this.subsidiaryLedgerAccountRepository.findById(this.treasuryAccounts['debtors']);
    }

    get treasuryCreditors() {
        return this.subsidiaryLedgerAccountRepository.findById(this.treasuryAccounts['creditors']);
    }

    get treasuryReceiveBusinessNotesInFund() {
        return this.subsidiaryLedgerAccountRepository.findById(this.treasuryAccounts['receiveBusinessNotesInFund']);
    }

    get treasuryReceiveBusinessNotesInProcess() {
        return this.subsidiaryLedgerAccountRepository.findById(this.treasuryAccounts['receiveBusinessNotesInProcess']);
    }

    get treasuryReceiveBusinessNotesRevocation() {
        return this.subsidiaryLedgerAccountRepository.findById(this.treasuryAccounts['receiveBusinessNotesRevocation']);
    }

    get treasuryReceiveBusinessNotesMissing() {
        return this.subsidiaryLedgerAccountRepository.findById(this.treasuryAccounts['receiveBusinessNotesMissing']);
    }

    get treasuryReceiveBusinessNotesSpend() {
        return this.subsidiaryLedgerAccountRepository.findById(this.treasuryAccounts['receiveBusinessNotesSpend']);
    }

    get treasuryReceiveBusinessNotesReturned() {
        return this.subsidiaryLedgerAccountRepository.findById(this.treasuryAccounts['receiveBusinessNotesReturned']);
    }

    get treasuryFundAccount() {
        return this.subsidiaryLedgerAccountRepository.findById(this.treasuryAccounts['fund']);
    }

    get treasuryBankAccount() {
        return this.subsidiaryLedgerAccountRepository.findById(this.treasuryAccounts['bank']);
    }

    get treasuryPaymentNotes() {
        return this.subsidiaryLedgerAccountRepository.findById(this.treasuryAccounts['paymentNotes']);
    }



    create(generalLedgerAccountId, cmd) {
        let errors = [];

        if (Utility.String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (cmd.title.length < 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (Utility.String.isNullOrEmpty(cmd.code))
            errors.push('کد نمیتواند خالی باشد');
        else if (this.subsidiaryLedgerAccountRepository.findByCode(cmd.code))
            errors.push('کد تکراری است');

        if (!this.generalLedgerAccountRepository.findById(generalLedgerAccountId))
            errors.push('حساب کل انتخاب شده وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            generalLedgerAccountId: generalLedgerAccountId,
            code: cmd.code,
            title: cmd.title,
            isBankAccount: cmd.isBankAccount,
            balanceType: cmd.balanceType,
            hasDetailAccount: cmd.hasDetailAccount,
            hasDimension1: cmd.hasDimension1,
            hasDimension2: cmd.hasDimension2,
            hasDimension3: cmd.hasDimension3
        };

        this.subsidiaryLedgerAccountRepository.create(entity);

        return entity.id;
    }

    update(id, cmd) {
        let errors = [];

        if (Utility.String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (cmd.title.length < 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (Utility.String.isNullOrEmpty(cmd.code))
            errors.push('کد نمیتواند خالی باشد');
        else if (this.subsidiaryLedgerAccountRepository.findByCode(cmd.code, id))
            errors.push('کد تکراری است');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            title: cmd.title,
            code: cmd.code,
            isBankAccount: cmd.isBankAccount,
            balanceType: cmd.balanceType,
            hasDetailAccount: cmd.hasDetailAccount,
            hasDimension1: cmd.hasDimension1,
            hasDimension2: cmd.hasDimension2,
            hasDimension3: cmd.hasDimension3
        };

        this.subsidiaryLedgerAccountRepository.update(id, entity);
    }

    remove(id) {
        let errors = [];

        if (this.subsidiaryLedgerAccountRepository.isUsedOnJournalLines(id))
            errors.push('حساب معین جاری در اسناد حسابداری استفاده شده ، امکان حذف وجود ندارد');

        if ((this.settings.subsidiaryLedgerAccounts || []).asEnumerable().any(item => item.id === id))
            errors.push('حساب معین جاری در تنظیمات استفاده شده ، امکان حذف وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.subsidiaryLedgerAccountRepository.remove(id);
    }
}
