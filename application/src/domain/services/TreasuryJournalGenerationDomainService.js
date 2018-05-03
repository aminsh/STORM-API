import {inject, injectable, postConstruct} from "inversify";
import {TreasurySettingRepository} from "../data/repository.treasury.setting";
import {JournalRepository} from "../data/repository.journal";
import {SubsidiaryLedgerAccountDomainService} from "./SubsidiaryLedgerAccountDomainService";
import {TreasuryChequeDomainService} from "./TreasuryChequeDomainService";

@injectable()
export class TreasuryJournalGenerationDomainService {

    /**@type {JournalDomainService}*/
    @inject("JournalDomainService") journalDomainService = undefined;

    /**@type {TreasurySettingRepository}*/
    @inject("TreasurySettingRepository") treasurySettingRepository = undefined;

    /**@type {SubsidiaryLedgerAccountDomainService}*/
    @inject("SubsidiaryLedgerAccountDomainService") subsidiaryLedgerAccountDomainService = undefined;

    /**@type {TreasuryRepository}*/
    @inject("TreasuryRepository") treasuryRepository = undefined;

    /**@type {SubsidiaryLedgerAccountRepository}*/
    @inject("SubsidiaryLedgerAccountRepository") subsidiaryLedgerAccountRepository = undefined;

    /**@type {DetailAccountRepository}*/
    @inject("DetailAccountRepository") detailAccountRepository = undefined;

    /**@type {TreasuryChequeDomainService}*/
    @inject("TreasuryChequeDomainService") treasuryChequeDomainService = undefined;

    /**@type {JournalRepository}*/
    @inject("JournalRepository") journalRepository = undefined;


    _validation(entity) {
        let errors = [];

        if (!entity)
            errors.push('{0} ثبت نشده است!'.format(Enums.TreasuryPaymentDocumentTypes().getDisplay(entity.documentType)));

        return errors;

    }

    generateForReceiveCash(treasuryId) {

        let persistedTreasury = this.treasuryRepository.findById(treasuryId),
            errors = this._validation(persistedTreasury);

        if (errors.length > 0)
            throw new ValidationException(errors);

        let subLedger = this.subsidiaryLedgerAccountDomainService,
            receiver = this.detailAccountRepository.findById(persistedTreasury.destinationDetailAccountId),
            payer = this.detailAccountRepository.findById(persistedTreasury.sourceDetailAccountId),


            journalLines = [],
            description = persistedTreasury
                ? 'بابت دریافت نقدی از {0} در تاریخ {1}'.format(payer.title, persistedTreasury.transferDate)
                : '';

        journalLines.push({
            generalLedgerAccountId: subLedger.treasuryFundAccount.generalLedgerAccountId,
            subsidiaryLedgerAccountId: subLedger.treasuryFundAccount.id,
            detailAccountId: persistedTreasury.destinationDetailAccountId,
            article: 'واریز به صندوق {0} '.format(receiver.title),
            debtor: persistedTreasury.amount,
            creditor: 0
        });

        journalLines.push({
            generalLedgerAccountId: subLedger.treasuryDebtors.generalLedgerAccountId,
            subsidiaryLedgerAccountId: subLedger.treasuryDebtors.id,
            detailAccountId: persistedTreasury.sourceDetailAccountId,
            article: 'دریافت نقدی از {0} '.format(payer.title),
            debtor: 0,
            creditor: persistedTreasury.amount
        });

        return persistedTreasury.journalId
            ? this.journalDomainService.update(persistedTreasury.journalId, {description, journalLines})
            : this.journalDomainService.create({description, journalLines});

    }

    generateForPaymentCash(treasuryId) {

        let persistedTreasury = this.treasuryRepository.findById(treasuryId),
            errors = this._validation(persistedTreasury);

        if (errors.length > 0)
            throw new ValidationException(errors);

        let subLedger = this.subsidiaryLedgerAccountDomainService,
            receiver = this.detailAccountRepository.findById(persistedTreasury.destinationDetailAccountId),
            payer = this.detailAccountRepository.findById(persistedTreasury.sourceDetailAccountId),

            journalLines = [],
            description = persistedTreasury
                ? 'بابت پرداخت نقدی به {0} در تاریخ {1}'.format(receiver.title, persistedTreasury.transferDate)
                : '';

        journalLines.push({
            generalLedgerAccountId: subLedger.treasuryCreditors.generalLedgerAccountId,
            subsidiaryLedgerAccountId: subLedger.treasuryCreditors.id,
            detailAccountId: persistedTreasury.destinationDetailAccountId,
            article: 'پرداخت به {0} '.format(receiver.title),
            debtor: persistedTreasury.amount,
            creditor: 0
        });

        journalLines.push({
            generalLedgerAccountId: subLedger.treasuryFundAccount.generalLedgerAccountId,
            subsidiaryLedgerAccountId: subLedger.treasuryFundAccount.id,
            detailAccountId: persistedTreasury.sourceDetailAccountId,
            article: 'پرداخت از {0} '.format(payer.title),
            debtor: 0,
            creditor: persistedTreasury.amount
        });

        return persistedTreasury.journalId
            ? this.journalDomainService.update(persistedTreasury.journalId, {description, journalLines})
            : this.journalDomainService.create({description, journalLines});
    }

    generateForReceiveReceipt(treasuryId) {

        let persistedTreasury = this.treasuryRepository.findById(treasuryId),
            errors = this._validation(persistedTreasury);

        if (errors.length > 0)
            throw new ValidationException(errors);

        let subLedger = this.subsidiaryLedgerAccountDomainService,
            receiver = this.detailAccountRepository.findById(persistedTreasury.destinationDetailAccountId),
            payer = this.detailAccountRepository.findById(persistedTreasury.sourceDetailAccountId),


            journalLines = [],
            description = persistedTreasury
                ? 'بابت فیش واریزی از {0} به شماره {1} در تاریخ {2}'.format(payer.title, persistedTreasury.documentDetail.number, persistedTreasury.documentDetail.date)
                : '';

        journalLines.push({
            generalLedgerAccountId: subLedger.treasuryBankAccount.generalLedgerAccountId,
            subsidiaryLedgerAccountId: subLedger.treasuryBankAccount.id,
            detailAccountId: persistedTreasury.destinationDetailAccountId,
            article: 'واریز به بانک {0} '.format(receiver.title),
            debtor: persistedTreasury.amount,
            creditor: 0
        });

        journalLines.push({
            generalLedgerAccountId: subLedger.treasuryDebtors.generalLedgerAccountId,
            subsidiaryLedgerAccountId: subLedger.treasuryDebtors.id,
            detailAccountId: persistedTreasury.sourceDetailAccountId,
            article: 'فیش واریزی توسط {0} '.format(payer.title),
            debtor: 0,
            creditor: persistedTreasury.amount
        });

        return persistedTreasury.journalId
            ? this.journalDomainService.update(persistedTreasury.journalId, {description, journalLines})
            : this.journalDomainService.create({description, journalLines});
    }

    generateForPaymentReceipt(treasuryId) {

        let persistedTreasury = this.treasuryRepository.findById(treasuryId),
            errors = this._validation(persistedTreasury);

        if (errors.length > 0)
            throw new ValidationException(errors);

        let subLedger = this.subsidiaryLedgerAccountDomainService,
            receiver = this.detailAccountRepository.findById(persistedTreasury.destinationDetailAccountId),
            payer = this.detailAccountRepository.findById(persistedTreasury.sourceDetailAccountId),


            journalLines = [],
            description = persistedTreasury
                ? 'بابت فیش واریزی به {0} به شماره {1} در تاریخ {2}'.format(receiver.title, persistedTreasury.documentDetail.number, persistedTreasury.documentDetail.date)
                : '';

        journalLines.push({
            generalLedgerAccountId: subLedger.treasuryCreditors.generalLedgerAccountId,
            subsidiaryLedgerAccountId: subLedger.treasuryCreditors.id,
            detailAccountId: persistedTreasury.destinationDetailAccountId,
            article: 'پرداخت به {0} '.format(receiver.title),
            debtor: persistedTreasury.amount,
            creditor: 0
        });

        journalLines.push({
            generalLedgerAccountId: subLedger.treasuryBankAccount.generalLedgerAccountId,
            subsidiaryLedgerAccountId: subLedger.treasuryBankAccount.id,
            detailAccountId: persistedTreasury.sourceDetailAccountId,
            article: 'پرداخت از بانک {0} '.format(payer.title),
            debtor: 0,
            creditor: persistedTreasury.amount
        });

        return persistedTreasury.journalId
            ? this.journalDomainService.update(persistedTreasury.journalId, {description, journalLines})
            : this.journalDomainService.create({description, journalLines});
    }

    generateForReceiveDemandNote(treasuryId) {

        let persistedTreasury = this.treasuryRepository.findById(treasuryId),
            errors = this._validation(persistedTreasury);

        if (errors.length > 0)
            throw new ValidationException(errors);

        let subLedger = this.subsidiaryLedgerAccountDomainService,
            payer = this.detailAccountRepository.findById(persistedTreasury.sourceDetailAccountId),


            journalLines = [],
            description = persistedTreasury
                ? 'بابت دریافت سفته از {0} در تاریخ {1}'
                    .format(payer.title, persistedTreasury.transferDate)
                : '';

        journalLines.push({
            generalLedgerAccountId: subLedger.treasuryFundAccount.generalLedgerAccountId,
            subsidiaryLedgerAccountId: subLedger.treasuryFundAccount.id,
            detailAccountId: persistedTreasury.destinationDetailAccountId,
            article: 'انتقال به صندوق',
            debtor: persistedTreasury.amount,
            creditor: 0
        });

        journalLines.push({
            generalLedgerAccountId: subLedger.treasuryDebtors.generalLedgerAccountId,
            subsidiaryLedgerAccountId: subLedger.treasuryDebtors.id,
            detailAccountId: persistedTreasury.sourceDetailAccountId,
            article: 'دریافت از {0} '.format(payer.title),
            debtor: 0,
            creditor: persistedTreasury.amount
        });

        return persistedTreasury.journalId
            ? this.journalDomainService.update(persistedTreasury.journalId, {description, journalLines})
            : this.journalDomainService.create({description, journalLines});
    }

    generateForPaymentDemandNote(treasuryId) {

        let persistedTreasury = this.treasuryRepository.findById(treasuryId),
            errors = this._validation(persistedTreasury);

        if (errors.length > 0)
            throw new ValidationException(errors);

        let subLedger = this.subsidiaryLedgerAccountDomainService,
            receiver = this.detailAccountRepository.findById(persistedTreasury.destinationDetailAccountId),


            journalLines = [],
            description = persistedTreasury
                ? 'بابت پرداخت سفته به {0} در تاریخ {1}'.format(receiver.title, persistedTreasury.transferDate)
                : '';

        journalLines.push({
            generalLedgerAccountId: subLedger.treasuryCreditors.generalLedgerAccountId,
            subsidiaryLedgerAccountId: subLedger.treasuryCreditors.id,
            detailAccountId: persistedTreasury.destinationDetailAccountId,
            article: 'پرداخت سفته به {0} '.format(receiver.title),
            debtor: persistedTreasury.amount,
            creditor: 0
        });

        journalLines.push({
            generalLedgerAccountId: subLedger.treasuryFundAccount.generalLedgerAccountId,
            subsidiaryLedgerAccountId: subLedger.treasuryFundAccount.id,
            detailAccountId: persistedTreasury.sourceDetailAccountId,
            article: 'پرداخت سفته',
            debtor: 0,
            creditor: persistedTreasury.amount
        });

        return persistedTreasury.journalId
            ? this.journalDomainService.update(persistedTreasury.journalId, {description, journalLines})
            : this.journalDomainService.create({description, journalLines});
    }

    generateForCheque(treasuryId) {
        let persistedTreasury = this.treasuryRepository.findById(treasuryId),
            errors = this._validation(persistedTreasury);

        if (persistedTreasury.treasuryType === 'receive' && persistedTreasury.documentDetail.status === 'spend')
            errors.push('امکان صدور سند برای چک خرج شده در لیست چک های پرداختی می باشد!');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let description = persistedTreasury
            ? 'بابت چک {0} {1} به شماره {2}'
                .format(
                    Enums.TreasuryType().getDisplay(persistedTreasury.treasuryType),
                    Enums.ReceiveChequeStatus().getDisplay(persistedTreasury.documentDetail.status),
                    persistedTreasury.documentDetail.number)
            : '',

            journalLines = persistedTreasury.treasuryType === 'receive'
                ? this.setReceiveJournalLines(persistedTreasury)
                : this.setPaymentJournalLines(persistedTreasury);

        return persistedTreasury.journalId
            ? this.journalDomainService.update(persistedTreasury.journalId, {description, journalLines})
            : this.journalDomainService.create({description, journalLines});

    }

    setReceiveJournalLines(treasury) {
        let subLedger = this.subsidiaryLedgerAccountDomainService,
            receiver = this.detailAccountRepository.findById(treasury.destinationDetailAccountId),
            payer = this.detailAccountRepository.findById(treasury.sourceDetailAccountId),
            persistedJournal = treasury.journalId ? this.journalRepository.findById(treasury.journalId) : null,
            lastSubLedger = persistedJournal ? persistedJournal.journalLines.asEnumerable().where(item => item.creditor === 0)
                    .select(item => ({
                        generalLedgerAccountId: item.generalLedgerAccountId,
                        subsidiaryLedgerAccountId: item.subsidiaryLedgerAccountId
                    })).first()
                : null;

        let journalLines = [];

        if (treasury.documentDetail.status === 'inFund') {

            journalLines.push({
                generalLedgerAccountId: subLedger.treasuryReceiveBusinessNotesInFund.generalLedgerAccountId,
                subsidiaryLedgerAccountId: subLedger.treasuryReceiveBusinessNotesInFund.id,
                detailAccountId: treasury.sourceDetailAccountId,
                article: 'چک به شماره {0} نزدصندوق '.format(treasury.documentDetail.number),
                debtor: treasury.amount,
                creditor: 0
            });

            journalLines.push({
                generalLedgerAccountId: lastSubLedger ? lastSubLedger.generalLedgerAccountId
                    : subLedger.treasuryDebtors.generalLedgerAccountId,
                subsidiaryLedgerAccountId: lastSubLedger ? lastSubLedger.subsidiaryLedgerAccountId
                    : subLedger.treasuryDebtors.id,
                detailAccountId: treasury.sourceDetailAccountId,
                article: 'دریافت چک از {0}  '.format(payer.title),
                debtor: 0,
                creditor: treasury.amount
            });
        }

        if (treasury.documentDetail.status === 'inProcessOnPassing') {

            journalLines.push({
                generalLedgerAccountId: subLedger.treasuryReceiveBusinessNotesInProcess.generalLedgerAccountId,
                subsidiaryLedgerAccountId: subLedger.treasuryReceiveBusinessNotesInProcess.id,
                detailAccountId: treasury.sourceDetailAccountId,
                article: 'چک به شماره {0} درجریان وصول '.format(treasury.documentDetail.number),
                debtor: treasury.amount,
                creditor: 0
            });

            journalLines.push({
                generalLedgerAccountId: lastSubLedger ? lastSubLedger.generalLedgerAccountId
                    : subLedger.treasuryDebtors.generalLedgerAccountId,
                subsidiaryLedgerAccountId: lastSubLedger ? lastSubLedger.subsidiaryLedgerAccountId
                    : subLedger.treasuryDebtors.id,
                detailAccountId: treasury.sourceDetailAccountId,
                article: 'دریافت چک از {0}'.format(payer.title),
                debtor: 0,
                creditor: treasury.amount
            });
        }

        if (treasury.documentDetail.status === 'return') {

            journalLines.push({
                generalLedgerAccountId: subLedger.treasuryDebtors.generalLedgerAccountId,
                subsidiaryLedgerAccountId: subLedger.treasuryDebtors.id,
                detailAccountId: treasury.sourceDetailAccountId,
                article: 'برگشت چک به شماره {0} از {1}'.format(treasury.documentDetail.number, payer.title),
                debtor: treasury.amount,
                creditor: 0
            });

            journalLines.push({
                generalLedgerAccountId: lastSubLedger ? lastSubLedger.generalLedgerAccountId
                    : subLedger.treasuryDebtors.generalLedgerAccountId,
                subsidiaryLedgerAccountId: lastSubLedger ? lastSubLedger.subsidiaryLedgerAccountId
                    : subLedger.treasuryDebtors.id,
                detailAccountId: treasury.sourceDetailAccountId,
                article: 'برگشت چک به شماره {0}'.format(treasury.documentDetail.number),
                debtor: 0,
                creditor: treasury.amount
            });
        }

        if (treasury.documentDetail.status === 'passed') {
            journalLines.push({
                generalLedgerAccountId: receiver.detailAccountType === 'bank'
                    ? subLedger.treasuryBankAccount.generalLedgerAccountId : subLedger.treasuryFundAccount.generalLedgerAccountId,
                subsidiaryLedgerAccountId: receiver.detailAccountType === 'bank'
                    ? subLedger.treasuryBankAccount.id : subLedger.treasuryFundAccount.id,
                detailAccountId: treasury.destinationDetailAccountId,
                article: 'بابت پاس شدن چک شماره {0} '.format(treasury.documentDetail.number),
                debtor: treasury.amount,
                creditor: 0
            });

            journalLines.push({
                generalLedgerAccountId: lastSubLedger ? lastSubLedger.generalLedgerAccountId
                    : subLedger.treasuryDebtors.generalLedgerAccountId,
                subsidiaryLedgerAccountId: lastSubLedger ? lastSubLedger.subsidiaryLedgerAccountId
                    : subLedger.treasuryDebtors.id,
                detailAccountId: treasury.sourceDetailAccountId,
                article: 'پاس چک {0} به شماره {1} '.format(payer.title, treasury.documentDetail.number),
                debtor: 0,
                creditor: treasury.amount
            });
        }

        if (treasury.documentDetail.status === 'revocation') {

            journalLines.push({
                generalLedgerAccountId: subLedger.treasuryDebtors.generalLedgerAccountId,
                subsidiaryLedgerAccountId: subLedger.treasuryDebtors.id,
                detailAccountId: treasury.sourceDetailAccountId,
                article: 'ابطال چک دریافتی از {0} به شماره {1}'.format(payer.title, treasury.documentDetail.number),
                debtor: treasury.amount,
                creditor: 0
            });

            journalLines.push({
                generalLedgerAccountId: lastSubLedger ? lastSubLedger.generalLedgerAccountId
                    : subLedger.treasuryDebtors.generalLedgerAccountId,
                subsidiaryLedgerAccountId: lastSubLedger ? lastSubLedger.subsidiaryLedgerAccountId
                    : subLedger.treasuryDebtors.id,
                detailAccountId: treasury.sourceDetailAccountId,
                article: 'ابطال چک به شماره {0}'.format(payer.title),
                debtor: 0,
                creditor: treasury.amount
            });
        }

        if (treasury.documentDetail.status === 'missing') {

            journalLines.push({
                generalLedgerAccountId: lastSubLedger ? lastSubLedger.generalLedgerAccountId
                    : subLedger.treasuryDebtors.generalLedgerAccountId,
                subsidiaryLedgerAccountId: lastSubLedger ? lastSubLedger.subsidiaryLedgerAccountId
                    : subLedger.treasuryDebtors.id,
                detailAccountId: treasury.sourceDetailAccountId,
                article: 'مفقود چک دریافتی از {0} به شماره {1}'.format(payer.title, treasury.documentDetail.number),
                debtor: treasury.amount,
                creditor: 0
            });

            journalLines.push({
                generalLedgerAccountId: lastSubLedger.generalLedgerAccountId,
                subsidiaryLedgerAccountId: lastSubLedger.subsidiaryLedgerAccountId,
                detailAccountId: treasury.sourceDetailAccountId,
                article: 'سرقت چک به شماره {0}'.format(payer.title),
                debtor: 0,
                creditor: treasury.amount
            });
        }

        /*if (treasury.documentDetail.status === 'spend') {

            journalLines.push({
                generalLedgerAccountId: subLedger.treasuryCreditors.generalLedgerAccountId,
                subsidiaryLedgerAccountId: subLedger.treasuryCreditors.id,
                detailAccountId: treasury.destinationDetailAccountId,
                article: 'انتقال/خرج چک شماره {0} به {1} '.format(treasury.documentDetail.number, receiver.title),
                debtor: treasury.amount,
                creditor: 0
            });

            journalLines.push({
                generalLedgerAccountId: lastSubLedger ? lastSubLedger.generalLedgerAccountId
                    : subLedger.treasuryDebtors.generalLedgerAccountId,
                subsidiaryLedgerAccountId: lastSubLedger ? lastSubLedger.subsidiaryLedgerAccountId
                    : subLedger.treasuryDebtors.id,
                detailAccountId: treasury.sourceDetailAccountId,
                article: 'انتقال/خرج چک {0} به شماره {1} '.format(payer.title, treasury.documentDetail.number),
                debtor: 0,
                creditor: treasury.amount
            });
        }*/

        return journalLines;
    }

    setPaymentJournalLines(treasury) {
        let subLedger = this.subsidiaryLedgerAccountDomainService,
            receiver = this.detailAccountRepository.findById(treasury.destinationDetailAccountId),
            persistedJournal = treasury.journalId ? this.journalRepository.findById(treasury.journalId) : null,
            lastSubLedger = persistedJournal ? persistedJournal.journalLines.asEnumerable().where(item => item.creditor === 0)
                    .select(item => ({
                        generalLedgerAccountId: item.generalLedgerAccountId,
                        subsidiaryLedgerAccountId: item.subsidiaryLedgerAccountId
                    })).first()
                : null;

        let journalLines = [];

        if (treasury.documentDetail.status === 'inProcessOnPassing') {

            journalLines.push({
                generalLedgerAccountId: subLedger.treasuryCreditors.generalLedgerAccountId,
                subsidiaryLedgerAccountId: subLedger.treasuryCreditors.id,
                detailAccountId: treasury.destinationDetailAccountId,
                article: 'پرذاخت چک به شماره {0}'.format(treasury.documentDetail.number),
                debtor: treasury.amount,
                creditor: 0
            });

            journalLines.push({
                generalLedgerAccountId: subLedger.treasuryPaymentNotes.generalLedgerAccountId,
                subsidiaryLedgerAccountId: subLedger.treasuryPaymentNotes.id,
                detailAccountId: treasury.sourceDetailAccountId,
                article: 'پرداخت چک به {0}  '.format(receiver.title),
                debtor: 0,
                creditor: treasury.amount
            });
        }

        if (treasury.documentDetail.status === 'return') {

            journalLines.push({
                generalLedgerAccountId: lastSubLedger ? lastSubLedger.generalLedgerAccountId
                    : subLedger.treasuryPaymentNotes.generalLedgerAccountId,
                subsidiaryLedgerAccountId: lastSubLedger ? lastSubLedger.subsidiaryLedgerAccountId
                    : subLedger.treasuryPaymentNotes.id,
                detailAccountId: treasury.sourceDetailAccountId,
                article: 'برگشت چک پرداختی به {0} شماره {1}'.format(receiver.title, treasury.documentDetail.number),
                debtor: treasury.amount,
                creditor: 0
            });

            journalLines.push({
                generalLedgerAccountId: subLedger.treasuryCreditors.generalLedgerAccountId,
                subsidiaryLedgerAccountId: subLedger.treasuryCreditors.id,
                detailAccountId: treasury.destinationDetailAccountId,
                article: 'برگشت چک به شماره {0}'.format(treasury.documentDetail.number),
                debtor: 0,
                creditor: treasury.amount
            });

            if (treasury.receiveId)
                this.generateForCheque(treasury.receiveId);
        }

        if (treasury.documentDetail.status === 'passed') {
            journalLines.push({
                generalLedgerAccountId: lastSubLedger ? lastSubLedger.generalLedgerAccountId
                    : subLedger.treasuryPaymentNotes.generalLedgerAccountId,
                subsidiaryLedgerAccountId: lastSubLedger ? lastSubLedger.subsidiaryLedgerAccountId
                    : subLedger.treasuryPaymentNotes.id,
                detailAccountId: treasury.destinationDetailAccountId,
                article: 'پاس چک {0} به شماره {0} '.format(receiver.title, treasury.documentDetail.number),
                debtor: treasury.amount,
                creditor: 0
            });

            journalLines.push({
                generalLedgerAccountId: subLedger.treasuryBankAccount.generalLedgerAccountId,
                subsidiaryLedgerAccountId: subLedger.treasuryBankAccount.id,
                detailAccountId: treasury.destinationDetailAccountId,
                article: 'بابت پاس شدن چک شماره {0} '.format(treasury.documentDetail.number),
                debtor: 0,
                creditor: treasury.amount
            });


        }

        if (treasury.documentDetail.status === 'revocation') {

            journalLines.push({
                generalLedgerAccountId: lastSubLedger ? lastSubLedger.generalLedgerAccountId
                    : subLedger.treasuryPaymentNotes.generalLedgerAccountId,
                subsidiaryLedgerAccountId: lastSubLedger ? lastSubLedger.subsidiaryLedgerAccountId
                    : subLedger.treasuryPaymentNotes.id,
                detailAccountId: treasury.destinationDetailAccountId,
                article: 'ابطال چک پرداختی به {0} به شماره {1}'.format(receiver.title, treasury.documentDetail.number),
                debtor: treasury.amount,
                creditor: 0
            });

            journalLines.push({
                generalLedgerAccountId: subLedger.treasuryCreditors.generalLedgerAccountId,
                subsidiaryLedgerAccountId: subLedger.treasuryCreditors.id,
                detailAccountId: treasury.destinationDetailAccountId,
                article: 'ابطال چک پرداختی به {0} شماره {1}'.format(receiver.title, treasury.documentDetail.number),
                debtor: 0,
                creditor: treasury.amount
            });
        }

        if (treasury.documentDetail.status === 'spend') {
            let receiveCheque = treasury.receiveId ? this.treasuryRepository.findById(treasury.receiveId) : null,
                receiveJournal = receiveCheque ? this.journalRepository.findById(receiveCheque.journalId) : null,
                receiveNote = receiveJournal ? receiveJournal.journalLines.asEnumerable().where(item => item.creditor === 0)
                        .select(item => ({
                            generalLedgerAccountId: item.generalLedgerAccountId,
                            subsidiaryLedgerAccountId: item.subsidiaryLedgerAccountId,
                            detailAccountId: item.detailAccountId
                        })).first()
                    : null,
                receiveNotePayer = this.detailAccountRepository.findById(receiveNote.detailAccountId),

                paymentNote = persistedJournal ? persistedJournal.journalLines.asEnumerable().where(item => item.debtor === 0)
                        .select(item => ({
                            generalLedgerAccountId: item.generalLedgerAccountId,
                            subsidiaryLedgerAccountId: item.subsidiaryLedgerAccountId,
                            detailAccountId: item.detailAccountId
                        })).first()
                    : null,
                paymentNotePayer = paymentNote && this.detailAccountRepository.findById(paymentNote.detailAccountId);


            journalLines.push({
                generalLedgerAccountId: subLedger.treasuryCreditors.generalLedgerAccountId,
                subsidiaryLedgerAccountId: subLedger.treasuryCreditors.id,
                detailAccountId: treasury.destinationDetailAccountId,
                article: 'خرج چک شماره {0} به {1}'.format(treasury.documentDetail.number, receiver.title),
                debtor: treasury.amount,
                creditor: 0
            });

            journalLines.push({
                generalLedgerAccountId: treasury.journalId ? paymentNote.generalLedgerAccountId : receiveNote.generalLedgerAccountId,
                subsidiaryLedgerAccountId: treasury.journalId ? paymentNote.subsidiaryLedgerAccountId : receiveNote.subsidiaryLedgerAccountId,
                detailAccountId: treasury.journalId ? paymentNote.detailAccountId : receiveNote.detailAccountId,
                article: 'خرج چک {0} به شماره {1}'.format(treasury.journalId ? paymentNotePayer.title : receiveNotePayer.title, treasury.documentDetail.number),
                debtor: 0,
                creditor: treasury.amount
            });
        }

        return journalLines;
    }

    generateForUpdateCheque(treasuryId) {
        let persistedTreasury = this.treasuryRepository.findById(treasuryId),
            errors = this._validation(persistedTreasury),
            chequeHistory = persistedTreasury.documentDetail.chequeStatusHistory.asEnumerable()
                .select(item => ({journalId: item.journalId, status: item.status})).toArray();

        if (!persistedTreasury || !persistedTreasury.journalId)
            errors.push('سند برای چک قبلا صادر نشده است!');

        if (errors.length > 0)
            throw new ValidationException(errors);

        chequeHistory.forEach(item => {

            persistedTreasury.documentDetail.status = item.status;
            persistedTreasury.journalId = item.journalId;

            let description = 'بابت چک {0} {1} به شماره {2}'
                    .format(
                        Enums.TreasuryType().getDisplay(persistedTreasury.treasuryType),
                        Enums.ReceiveChequeStatus().getDisplay(persistedTreasury.documentDetail.status),
                        persistedTreasury.documentDetail.number),

                journalLines = persistedTreasury.treasuryType === 'receive'
                    ? this.setReceiveJournalLines(persistedTreasury)
                    : this.setPaymentJournalLines(persistedTreasury);

            this.journalDomainService.update(persistedTreasury.journalId, {description, journalLines});
        });
    }

    generateForTransfer(treasuryId) {

        let persistedTreasury = this.treasuryRepository.findById(treasuryId),
            errors = this._validation(persistedTreasury);

        if (errors.length > 0)
            throw new ValidationException(errors);

        let subLedger = this.subsidiaryLedgerAccountDomainService,
            destination = this.detailAccountRepository.findById(persistedTreasury.destinationDetailAccountId),
            source = this.detailAccountRepository.findById(persistedTreasury.sourceDetailAccountId);


        let journalLines = [],
            description = persistedTreasury
                ? 'بابت انتقال از {0} به {1}'.format(source.title, destination.title)
                : '';

        journalLines.push({
            generalLedgerAccountId: destination.detailAccountType === 'bank'
                ? subLedger.treasuryBankAccount.generalLedgerAccountId
                : subLedger.treasuryFundAccount.generalLedgerAccountId,
            subsidiaryLedgerAccountId: destination.detailAccountType === 'bank'
                ? subLedger.treasuryBankAccount.id
                : subLedger.treasuryFundAccount.id,
            detailAccountId: persistedTreasury.destinationDetailAccountId,
            article: 'انتقال وجه به {0} در تاریخ {1} '.format(destination.title, persistedTreasury.transferDate),
            debtor: persistedTreasury.amount,
            creditor: 0
        });

        journalLines.push({
            generalLedgerAccountId: source.detailAccountType === 'bank'
                ? subLedger.treasuryBankAccount.generalLedgerAccountId
                : subLedger.treasuryFundAccount.generalLedgerAccountId,
            subsidiaryLedgerAccountId: source.detailAccountType === 'bank'
                ? subLedger.treasuryBankAccount.id
                : subLedger.treasuryFundAccount.id,
            detailAccountId: persistedTreasury.sourceDetailAccountId,
            article: 'انتقال وجه از {0} در تاریخ {1} '.format(source.title, persistedTreasury.transferDate),
            debtor: 0,
            creditor: persistedTreasury.amount
        });

        return persistedTreasury.journalId
            ? this.journalDomainService.update(persistedTreasury.journalId, {description, journalLines})
            : this.journalDomainService.create({description, journalLines});
    }

}
