"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    String = require('../utilities/string'),
    DetailAccountRepository = require('../data/repository.detailAccount'),
    DetailAccountQuery = require('../queries/query.detailAccount'),
    JournalRepository = require('../data/repository.journal');

router.route('/')
    .get(async((req, res) => {
        let detailAccountQuery = new DetailAccountQuery(req.branchId),
            result = await(detailAccountQuery.getAllBanks(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let detailAccountRepository = new DetailAccountRepository(req.branchId),
            cmd = req.body,
            errors = [],
            entity = {
                code: cmd.code,
                title: cmd.title,
                bank: cmd.bank,
                bankBranch: cmd.bankBranch,
                bankAccountNumber: cmd.bankAccountNumber,
                detailAccountType: 'bank'
            };

        if (String.isNullOrEmpty(entity.title))
            errors.push('عنوان نمیتواند خالی باشد');

        if (String.isSmallerThan3Chars(entity.title))
            errors.push('عنوان نمیتواند کمتر از 3 کاراکتر باشد');

        if (errors.length)
            return res.json({isValid: false, errors});

        await(detailAccountRepository.create(entity));

        res.json({isValid: true, returnValue: {id: entity.id}});

    }));

router.route('/:id')
    .get(async((req, res) => {
        let detailAccountQuery = new DetailAccountQuery(req.branchId),
            result = await(detailAccountQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        let detailAccountRepository = new DetailAccountRepository(req.branchId),
            cmd = req.body,
            errors = [],
            entity = await(detailAccountRepository.findById(req.params.id));

        entity.code = cmd.code;
        entity.title = cmd.title;
        entity.bank = cmd.bank;
        entity.bankBranch = cmd.bankBranch;
        entity.bankAccountNumber = cmd.bankAccountNumber;

        if (String.isNullOrEmpty(entity.title))
            errors.push('عنوان نمیتواند خالی باشد');

        if (String.isSmallerThan3Chars(entity.title))
            errors.push('عنوان نمیتواند کمتر از 3 کاراکتر باشد');

        if (errors.length)
            return res.json({isValid: false, errors});

        await(detailAccountRepository.update(entity));

        res.json({isValid: true});
    }))
    .delete(async((req, res) => {
        let detailAccountRepository = new DetailAccountRepository(req.branchId),
            journalRepository = new JournalRepository(req.branchId),

            id = req.params.id,
            errors = [];

        if (await(journalRepository.isExistsDetailAccount(id)))
            errors.push('برای حساب بانکی جاری تراکنش ثبت شده . نمیتوانید حذف کنید');

        if (errors.length)
            return res.json({isValid: false, errors});

        await(detailAccountRepository.remove(id));
        res.json({isValid: true});
    }));


router.route('/:id/small-turnover').get(async((req, res) => {
    let detailAccountQuery = new DetailAccountQuery(req.branchId),
        result = await(detailAccountQuery.getAllSmallTurnoverById(
            req.params.id,
            'bank',
            req.fiscalPeriodId,
            req.query));

    res.json(result);
}));

module.exports = router;