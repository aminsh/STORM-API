"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    JournalRepository = require('../data/repository.journal'),
    SubsidiaryLedgerAccountRepository = require('../data/repository.subsidiaryLedgerAccount'),
    InvoiceRepository = require('../data/repository.invoice'),
    translate = require('../services/translateService'),
    EventEmitter = require('../services/shared').service.EventEmitter;

EventEmitter.on('on-sale-created', async((sale, current) => {

    let journalRepository = new JournalRepository(current.branchId),
        subsidiaryLedgerAccountRepository = new SubsidiaryLedgerAccountRepository(current.branchId),
        invoiceRepository = new InvoiceRepository(current.branchId),

        invoiceLines = sale.invoiceLines,
        sumAmount = invoiceLines.asEnumerable().sum(line => line.unitPrice * line.quantity),
        sumDiscount = invoiceLines.asEnumerable().sum(line => line.discount),
        sumVat = invoiceLines.asEnumerable().sum(line => line.vat),
        description = translate('For Cash sale invoice number ...').format(sale.number),
        maxNumber = await(journalRepository.maxTemporaryNumber(current.fiscalPeriodId)).max || 0,
        journal = {
            periodId: current.fiscalPeriodId,
            createdById: current.userId,
            journalStatus: 'Temporary',
            temporaryNumber: ++maxNumber,
            temporaryDate: sale.date,
            description: description,
            isInComplete: false
        },
        receivableSubLedgerAccount = await(subsidiaryLedgerAccountRepository.findByCode('1104')),
        saleSubLedgerAccount = await(subsidiaryLedgerAccountRepository.findByCode('6101')),
        journalLines = [
            {
                generalLedgerAccountId: receivableSubLedgerAccount.generalLedgerAccountId,
                subsidiaryLedgerAccountId: receivableSubLedgerAccount.id,
                detailAccountId: sale.detailAccountId,
                debtor: sumAmount - sumDiscount + sumVat,
                creditor: 0,
                article: description,
                row: 1
            }, {
                generalLedgerAccountId: saleSubLedgerAccount.generalLedgerAccountId,
                subsidiaryLedgerAccountId: saleSubLedgerAccount.id,
                detailAccountId: sale.detailAccountId,
                debtor: 0,
                creditor: sumAmount,
                article: description,
                row: 3
            }];

    if (sumDiscount > 0) {
        let discountSubLedgerAccount = await(subsidiaryLedgerAccountRepository.findByCode('8305'));

        journalLines.push({
            generalLedgerAccountId: discountSubLedgerAccount.generalLedgerAccountId,
            subsidiaryLedgerAccountId: discountSubLedgerAccount.id,
            debtor: sumDiscount,
            creditor: 0,
            article: description,
            row: 2
        });
    }


    if (sumVat > 0) {
        let vatSubLedgerAccount = await(subsidiaryLedgerAccountRepository.findByCode('2106'));

        journalLines.push({
            generalLedgerAccountId: vatSubLedgerAccount.generalLedgerAccountId,
            subsidiaryLedgerAccountId: vatSubLedgerAccount.id,
            debtor: 0,
            creditor: sumVat,
            article: description,
            row: 4
        });
    }

    let id = await(journalRepository.batchCreate(journalLines, journal));

    await(invoiceRepository.update(sale.id, {journalId: id}));

}));
