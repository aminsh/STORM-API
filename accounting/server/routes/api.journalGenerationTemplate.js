"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    JournalGenerationTemplateQuery = require('../queries/query.journalGenerationTemplate');

router.route('/:sourceType')
    .get(async((req, res) => {
        const journalGenerationTemplateQuery = new JournalGenerationTemplateQuery(req.branchId),
            result = await(journalGenerationTemplateQuery.getBySourceType(req.params.sourceType));

        res.json(result);
    }))

    .post(async((req, res) => {
        const Handler = require('../domain/journalGenerationTemplate/steps/createOrUpdateGenerationTemplate'),
            handler = new Handler(
                {branchId: req.branchId},
                Object.assign(req.body, {sourceType: req.params.sourceType}));

        await(handler.run());

        res.json({isValid: true, returnValue: handler.result});

    }));


module.exports = router;