"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    JournalRepository = require('../data/repository.journal'),
    JournalLineRepository = require('../data/repository.journalLine'),
    JournalLineQuery = require('../queries/query.journalLine'),
    SubsidiaryLedgerAccountRepository = require('../data/repository.subsidiaryLedgerAccount'),
    DetailAccountRepository = require('../data/repository.detailAccount'),
    FiscalPeriodRepository = require('../data/repository.fiscalPeriod'),
    translate = require('../services/translateService'),
    String = require('../services/shared').utility.String,
    persianDateSerivce = require('../services/persianDateService');

module.exports = class JournalService {

    constructor(branchId, currentFiscalPeriodId, userId) {
        this.journalRepository = new JournalRepository(branchId);
        this.fiscalPeriodRepository = new FiscalPeriodRepository(branchId);
        this.subsidiaryLedgerAccountRepository = new SubsidiaryLedgerAccountRepository(branchId);
        this.detailAccountRepository = new DetailAccountRepository(branchId),
            this.currentFiscalPeriod = await(this.fiscalPeriodRepository.findById(currentFiscalPeriodId));
        this.userId = userId;

        this.create = async(this.create);
        this.createBySale = async(this.createBySale);
        this.createBySalePaidToBank = async(this.createBySalePaidToBank);
        this.createBySalePaidToFund = async(this.createBySalePaidToFund);
        this.createBySaleNotPaid = async(this.createBySaleNotPaid);
    }

    create(cmd) {
        let entity = {
            periodId: this.currentFiscalPeriod.id,
            createdById: this.userId,
            journalStatus: 'Temporary',
            temporaryNumber: this.journalRepository.maxTemporaryNumber(this.currentFiscalPeriod.id),
            temporaryDate: persianDateSerivce.current(),
            description: cmd.description,
            isInComplete: false,
            attachmentFileName: cmd.attachmentFileName,
            journalType: cmd.journalType,
            tagId: cmd.tagId
        };

        let journalLines = cmd.journalLines.asEnumerable()
            .select(journalLine => {

                return {
                    generalLedgerAccountId: await(this.subsidiaryLedgerAccountRepository.findById(journalLine.subsidiaryLedgerAccountId)),
                    subsidiaryLedgerAccountId: journalLine.subsidiaryLedgerAccountId,
                    detailAccountId: journalLine.detailAccountId,
                    dimension1Id: journalLine.dimension1Id,
                    dimension2Id: journalLine.dimension2Id,
                    dimension3Id: journalLine.dimension3Id,
                    article: journalLine.article,
                    debtor: journalLine.debtor,
                    creditor: journalLine.creditor,
                    row: journalLine.row,
                    receiptNumber: journalLine.receipt ? journalLine.receipt.number : null,
                    receiptDate: journalLine.receipt ? journalLine.receipt.date : null,
                }
            })
            .toArray();

        let id = await(this.journalRepository.batchCreate(journalLines, entity));

        return {id};
    }

    createBySalePaidToBank(sale, bankAccountNumber) {
        let subsidiaryLedgerAccountId = await(this.subsidiaryLedgerAccountRepository.findByCode('1103')).id,
            detailAccountId = await(this.detailAccountRepository.findBankAccountNumber(bankAccountNumber)).id;

        return this.createBySale(sale, {subsidiaryLedgerAccountId, detailAccountId});
    }

    createBySalePaidToFund(sale, fundCode) {
        let subsidiaryLedgerAccountId = await(this.subsidiaryLedgerAccountRepository.findByCode('1101')).id,
            detailAccountId = await(this.detailAccountRepository.findFund(fundCode)).id;

        return this.createBySale(sale, {subsidiaryLedgerAccountId, detailAccountId});
    }

    createBySaleNotPaid(sale) {
        let subsidiaryLedgerAccountId = await(this.subsidiaryLedgerAccountRepository.findByCode('1104')).id,
            detailAccountId = sale.detailAccountId;

        return this.createBySale(sale, {subsidiaryLedgerAccountId, detailAccountId});
    }

    createBySale(sale, fundAndBank) {
        let saleLines = sale.saleLines,
            sumAmount = saleLines.asEnumerable().sum(line => line.unitPrice * line.quantity),
            sumDiscount = saleLines.asEnumerable().sum(line => line.discount),
            sumVat = saleLines.asEnumerable().sum(line => line.vat),
            description = translate('For Cash invoice number').format(sale.number),
            entity = {description},
            lines = [
                {
                    subsidiaryLedgerAccountId: fundAndBank.subsidiaryLedgerAccountId,
                    detailAccountId: fundAndBank.detailAccountId,
                    debtor: sumAmount - sumDiscount + sumVat,
                    creditor: 0,
                    article: description,
                    row: 1
                }, {
                    subsidiaryLedgerAccountId: await(this.subsidiaryLedgerAccountRepository.findByCode('6101')).id,
                    detailAccountId: sale.detailAccountId,
                    debtor: 0,
                    creditor: sumAmount,
                    article: description,
                    row: 3
                }];

        if (sumDiscount > 0)
            lines.push({
                subsidiaryLedgerAccountId: await(this.subsidiaryLedgerAccountRepository.findByCode('8305')).id,
                debtor: sumDiscount,
                creditor: 0,
                article: description,
                row: 2
            });

        if (sumVat > 0)
            lines.push({
                subsidiaryLedgerAccountId: await(this.subsidiaryLedgerAccountRepository.findByCode('2106')).id,
                debtor: 0,
                creditor: sumVat,
                article: description,
                row: 4
            });

        entity.journalLines = lines;

        return this.create(entity);
    }
};