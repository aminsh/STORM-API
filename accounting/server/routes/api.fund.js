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
            result = await(detailAccountQuery.getAllFunds(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let detailAccountRepository = new DetailAccountRepository(req.branchId),
            cmd = req.body,
            errors = [],
            entity = {
                code: cmd.code,
                title: cmd.title,
                detailAccountType: 'fund'
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
            errors.push('برای صندوق جاری تراکنش ثبت شده . نمیتوانید حذف کنید');

        if (errors.length)
            return res.json({isValid: false, errors});

        await(detailAccountRepository.remove(id));
        res.json({isValid: true});
    }));


module.exports = router;