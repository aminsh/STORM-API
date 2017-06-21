"use strict";"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    JournalRepository = require('../data/repository.journal'),
    SubsidiaryLedgerAccountRepository = require('../data/repository.subsidiaryLedgerAccount'),
    InvoiceRepository = require('../data/repository.invoice'),
    translate = require('../services/translateService'),
    EventEmitter = require('../services/shared').service.EventEmitter;

/*
* 1111 مالیات بر ارزش افزوده خرید
* 5101 خرید کالا
* 2102 حسابهای پرداختنی
* 7203 تخفیفات نقدی خرید
* */

EventEmitter.on('on-purchase-created', async((purchase, current) => {

    let journalRepository = new JournalRepository(current.branchId),
        subsidiaryLedgerAccountRepository = new SubsidiaryLedgerAccountRepository(current.branchId),
        invoiceRepository = new InvoiceRepository(current.branchId),

        invoiceLines = purchase.invoiceLines,
        sumAmount = invoiceLines.asEnumerable().sum(line => line.unitPrice * line.quantity),
        sumDiscount = invoiceLines.asEnumerable().sum(line => line.discount),
        sumVat = invoiceLines.asEnumerable().sum(line => line.vat),
        description = translate('For Cash purchase invoice number ...').format(purchase.number),
        maxNumber = await(journalRepository.maxTemporaryNumber(current.fiscalPeriodId)).max || 0,
        journal = {
            periodId: current.fiscalPeriodId,
            createdById: current.userId,
            journalStatus: 'Temporary',
            temporaryNumber: ++maxNumber,
            temporaryDate: purchase.date,
            description: description,
            isInComplete: false
        },
        payableSubLedgerAccount = await(subsidiaryLedgerAccountRepository.findByCode('2101')),
        purchaseSubLedgerAccount = await(subsidiaryLedgerAccountRepository.findByCode('5101')),
        journalLines = [
            {
                generalLedgerAccountId: payableSubLedgerAccount.generalLedgerAccountId,
                subsidiaryLedgerAccountId: payableSubLedgerAccount.id,
                detailAccountId: purchase.detailAccountId,
                debtor: 0,
                creditor: sumAmount - sumDiscount + sumVat,
                article: description,
                row: 1
            }, {
                generalLedgerAccountId: purchaseSubLedgerAccount.generalLedgerAccountId,
                subsidiaryLedgerAccountId: purchaseSubLedgerAccount.id,
                //detailAccountId: purchase.detailAccountId, purchase does n`t have detailAccount
                debtor: sumAmount,
                creditor: 0,
                article: description,
                row: 3
            }];

    if (sumDiscount > 0) {
        let discountSubLedgerAccount = await(subsidiaryLedgerAccountRepository.findByCode('7203'));

        journalLines.push({
            generalLedgerAccountId: discountSubLedgerAccount,
            subsidiaryLedgerAccountId: discountSubLedgerAccount.id,
            debtor: 0,
            creditor: sumDiscount,
            article: description,
            row: 2
        });
    }


    if (sumVat > 0) {
        let vatSubLedgerAccount = await(subsidiaryLedgerAccountRepository.findByCode('1111'));

        journalLines.push({
            generalLedgerAccountId: vatSubLedgerAccount.generalLedgerAccountId,
            subsidiaryLedgerAccountId: vatSubLedgerAccount.id,
            debtor: sumVat,
            creditor: 0,
            article: description,
            row: 4
        });
    }

    let id = await(journalRepository.batchCreate(journalLines, journal));

    await(invoiceRepository.update(purchase.id, {journalId: id}));

}));
