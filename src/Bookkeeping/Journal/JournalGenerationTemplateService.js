import _ from "lodash";
import {inject, injectable} from "inversify";

_.templateSettings.interpolate = /#([\s\S]+?)#/g;

@injectable()
export class JournalGenerationTemplateService {

    /** @type {JournalGenerationTemplateRepository}*/
    @inject("JournalGenerationTemplateRepository") journalGenerationTemplateRepository = undefined;

    /**@type{JournalGenerationTemplateEngine}*/
    @inject("JournalGenerationTemplateEngine") journalGenerationTemplateEngine = undefined;

    @inject("Factory<Mapper>") mapperFactory = undefined;

    generate(cmd, sourceType) {

        let generationTemplate = this.journalGenerationTemplateRepository.findBySourceType(sourceType);

        if (!generationTemplate)
            throw new ValidationException(['الگوی ساخت سند حسابداری وجود ندارد']);

        generationTemplate = generationTemplate.data;

        const mapper = this.mapperFactory(sourceType);

        const journal = this.journalGenerationTemplateEngine.handler(generationTemplate, mapper.map(cmd));

        journal.journalLines = journal.journalLines.asEnumerable()
            .where(item => (item.debtor + item.creditor) !== 0)
            .orderByDescending(item => item.debtor)
            .toArray();

        return journal;
    }

    createJournalTemplate(sourceType, cmd) {
        let entity = {
                title: cmd.title,
                data: cmd.data
            },
            isExits = this.journalGenerationTemplateRepository.findBySourceType(sourceType);

        if (isExits)
            this.journalGenerationTemplateRepository.update(sourceType, entity);
        else
            this.journalGenerationTemplateRepository.create(sourceType, entity);

        return entity.id;
    }
}
