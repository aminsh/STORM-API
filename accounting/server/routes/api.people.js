"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    String = require('../utilities/string'),
    DetailAccountRepository = require('../data/repository.detailAccount'),
    DetailAccountQuery = require('../queries/query.detailAccount'),
    InvoiceRepository = require('../data/repository.invoice'),
    JournalRepository = require('../data/repository.journal'),
    PersonQuery = require('../queries/query.person');

router.route('/:id/summary/sale/by-month').get(async((req, res) => {
    let personQuery = new PersonQuery(req.branchId),
        result = await(personQuery.getTotalPriceAndCountByMonth(req.params.id, req.fiscalPeriodId));
    res.json(result);
}));

router.route('/')
    .get(async((req, res) => {
        let detailAccountQuery = new DetailAccountQuery(req.branchId),
            result = await(detailAccountQuery.getAllPeople(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let detailAccountRepository = new DetailAccountRepository(req.branchId),
            cmd = req.body,
            entity = {
                code: cmd.code,
                title: cmd.title,
                address: cmd.address,
                postalCode: cmd.postalCode,
                province: cmd.province,
                city: cmd.city,
                phone: cmd.phone,
                nationalCode: cmd.nationalCode,
                email: cmd.email,
                personType: cmd.personType,
                detailAccountType: 'person',
                economicCode: cmd.economicCode
            },
            errors = [];

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
        entity.address = cmd.address;
        entity.postalCode = cmd.postalCode;
        entity.province = cmd.province;
        entity.city = cmd.city;
        entity.phone = cmd.phone;
        entity.nationalCode = cmd.nationalCode;
        entity.email = cmd.email;
        entity.personType = cmd.personType;
        entity.economicCode = cmd.economicCode;

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
            invoiceRepository = new InvoiceRepository(req.branchId),
            journalRepository = new JournalRepository(req.branchId),

            id = req.params.id,
            errors = [];

        if (await(invoiceRepository.isExistsCustomer(id)))
            errors.push('برای شخص جاری فاکتور صادره شده . نمیتوانید حذف کنید');

        if (await(journalRepository.isExistsDetailAccount(id)))
            errors.push('برای شخص جاری تراکنش ثبت شده . نمیتوانید حذف کنید');

        if (errors.length)
            return res.json({isValid: false, errors});

        await(detailAccountRepository.remove(id));

        res.json({isValid: true});
    }));


module.exports = router;