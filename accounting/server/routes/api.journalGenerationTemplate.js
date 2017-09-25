"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    JournalGenerationTemplateRepository = require('../data/repository.journalGenerationTemplate'),
    JournalGenerationTemplateQuery = require('../queries/query.journalGenerationTemplate');

router.route('/:sourceType')
    .get(async((req, res) => {
        const journalGenerationTemplateQuery = new JournalGenerationTemplateQuery(req.branchId),
            result = await(journalGenerationTemplateQuery.getBySourceType(req.params.sourceType));

        res.json(result);
    }))

    .post(async((req, res) => {

        let journalGenerationTemplateRepository = new JournalGenerationTemplateRepository(req.branchId),
            sourceType = req.params.sourceType,
            cmd = req.body,
            entity = {
                title: cmd.title,
                data: cmd.data
            },
            isExits = await(this.journalGenerationRepository.findBySourceType(sourceType));

        if (isExits)
            await(journalGenerationTemplateRepository.update(sourceType, entity));
        else
            await(journalGenerationTemplateRepository.create(sourceType, entity));

        res.json({isValid: true, returnValue: {id: entity.id}});

    }));


module.exports = router;