"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    string = require('../utilities/string'),
    router = require('express').Router(),
    GeneralLedgerAccountRepository = require('../data/repository.generalLedgerAccount'),
    SubsidiaryLedgerAccountRepository = require('../data/repository.subsidiaryLedgerAccount'),
    GeneralLedgerAccountQuery = require('../queries/query.generalLedgerAccount'),
    translate = require('../services/translateService'),
    enums = require('../../../shared/enums'),
    defaultGeneralLedgerAccounts = require('../config/generalLedgerAccounts.json').RECORDS,
    defaultSubsidiaryLedgerAccounts = require('../config/subsidiaryLedgerAccounts.json').RECORDS,
    groups = getChartOfAccount();


router.route('/')
    .get(async((req, res) => {
        let generalLedgerAccountQuery = new GeneralLedgerAccountQuery(req.branchId),
            result = await(generalLedgerAccountQuery.getAll(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let generalLedgerAccountRepository = new GeneralLedgerAccountRepository(req.branchId),
            errors = [],
            cmd = req.body;

        if (string.isNullOrEmpty(cmd.code))
            errors.push(translate('The code is required'));
        else {
            var gla = await(generalLedgerAccountRepository.findByCode(cmd.code));

            if (gla)
                errors.push(translate('The code is duplicated'));
        }

        if (string.isNullOrEmpty(cmd.title))
            errors.push(translate('The title is required'));
        else {
            if (cmd.title.length < 3)
                errors.push(translate('The title should have at least 3 character'));
        }

        if (errors.asEnumerable().any())
            return res.json({
                isValid: false,
                errors: errors
            });

        let entity = {
            code: cmd.code,
            title: cmd.title,
            postingType: cmd.postingType,
            balanceType: cmd.balanceType,
            description: cmd.description,
            groupingType: cmd.groupingType
        };

        entity = await(generalLedgerAccountRepository.create(entity));

        return res.json({
            isValid: true,
            returnValue: {id: entity.id}
        });
    }));

router.route('/chart-of-accounts')
    .get(async((req, res) => {
        const generalLedgerAccountQuery = new GeneralLedgerAccountQuery(req.branchId),
            result = await(generalLedgerAccountQuery.chartOfAccount());
        res.json(result);
    }));

router.route('/default/chart-of-accounts')
    .get((req, res) => {
        res.json(groups);
    })
    .post(async((req, res) => {
        let branchId = req.branchId,
            generalLedgerAccountRepository = new GeneralLedgerAccountRepository(branchId),
            subsidiaryLedgerAccountRepository = new SubsidiaryLedgerAccountRepository(branchId);


        groups.forEach(g => {
            g.generalLedgerAccounts.forEach(async(gla => {
                let newGla = {
                    title: gla.title,
                    code: gla.code,
                    groupingType: g.key,
                    balanceType: gla.balanceType,
                    postingType: gla.postingType,
                    isLocked: gla.isLocked,
                    branchId
                };

                await(generalLedgerAccountRepository.create(newGla));

                gla.subsidiaryLedgerAccounts.forEach(async(sla => {
                    let entity = {
                        title: sla.title,
                        code: sla.code,
                        generalLedgerAccountId: newGla.id,
                        isLocked: sla.isLocked,
                        branchId
                    };

                    await(subsidiaryLedgerAccountRepository.create(entity));
                }));
            }));
        });

        res.json({isValid: true});
    }));

router.route('/:id')
    .get(async((req, res) => {
        let generalLedgerAccountQuery = new GeneralLedgerAccountQuery(req.branchId),
            result = await(generalLedgerAccountQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        let generalLedgerAccountRepository = new GeneralLedgerAccountRepository(req.branchId),
            errors = [],
            cmd = req.body,
            id = req.params.id,
            account = await(generalLedgerAccountRepository.findById(id));

        if (string.isNullOrEmpty(cmd.code))
            errors.push(translate('The code is required'));
        else {
            var gla = await(generalLedgerAccountRepository.findByCode(cmd.code, id));

            if (gla)
                errors.push(translate('The code is duplicated'));
        }

        if (string.isNullOrEmpty(cmd.title))
            errors.push(translate('The title is required'));
        else {
            if (cmd.title.length < 3)
                errors.push(translate('The title should have at least 3 character'));
        }

        if (errors.asEnumerable().any())
            return res.json({
                isValid: false,
                errors: errors
            });

        let title = account.isLocked ? account.title : cmd.title,
            code = account.isLocked ? account.code : cmd.code;

        let entity = {
            id,
            title,
            code,
            postingType: cmd.postingType,
            balanceType: cmd.balanceType,
            description: cmd.description,
            groupingType: cmd.groupingType
        };

        await(generalLedgerAccountRepository.update(entity));

        return res.json({isValid: true});
    }))
    .delete(async((req, res) => {
        let generalLedgerAccountRepository = new GeneralLedgerAccountRepository(req.branchId),
            errors = [],
            cmd = req.body,
            gla = await(generalLedgerAccountRepository.findById(req.params.id));

        if (gla.isLocked)
            errors.push('این حساب قفل است - امکان حذف وجود ندارد');

        if (gla.subsidiaryLedgerAccounts.asEnumerable().any())
            errors
                .push(translate('The Current Account has Subsidiary ledger account'));

        //check for journal line

        if (errors.asEnumerable().any())
            return res.json({
                isValid: false,
                errors: errors
            });

        await(generalLedgerAccountRepository.remove(req.params.id));

        return res.json({isValid: true});
    }));

router.route('/:id/activate').put(async((req, res) => {
    let generalLedgerAccountRepository = new GeneralLedgerAccountRepository(req.branchId),
        entity = await(generalLedgerAccountRepository.findById(req.params.id));

    entity.isActive = true;

    await(generalLedgerAccountRepository.update(entity));

    return res.json({isValid: true});
}));

router.route('/:id/deactivate').put(async((req, res) => {
    let generalLedgerAccountRepository = new GeneralLedgerAccountRepository(req.branchId),
        entity = await(generalLedgerAccountRepository.findById(req.params.id));

    entity.isActive = false;

    await(generalLedgerAccountRepository.update(entity));

    return res.json({isValid: true});
}));


module.exports = router;

function getChartOfAccount() {
    defaultGeneralLedgerAccounts.forEach(gla => {
        let subs = defaultSubsidiaryLedgerAccounts
            .asEnumerable()
            .where(sla => sla.generalLedgerAccountId == parseInt(gla.code))
            .toArray();
        gla.subsidiaryLedgerAccounts = subs;
    });

    let groups = enums.AccountGroupingType().data;

    groups.forEach(g => {
        let generals = defaultGeneralLedgerAccounts
            .asEnumerable()
            .where(gla => gla.groupLedgerAccountId == parseInt(g.key))
            .toArray();
        g.generalLedgerAccounts = generals;
    });

    return groups;
}