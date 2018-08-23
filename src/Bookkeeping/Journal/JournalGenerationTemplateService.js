import _ from "lodash";
import {inject, injectable} from "inversify";

_.templateSettings.interpolate = /#([\s\S]+?)#/g;

@injectable()
export class JournalGenerationTemplateService {

    /** @type {JournalGenerationTemplateRepository}*/
    @inject("JournalGenerationTemplateRepository") journalGenerationTemplateRepository = undefined;

    generate(cmd, sourceType) {

        let generationTemplate = this.journalGenerationTemplateRepository.findBySourceType(sourceType);

        if (!generationTemplate)
            throw new ValidationException(['الگوی ساخت سند حسابداری وجود ندارد']);

        generationTemplate = generationTemplate.data;

        let journal = {
            description: this._render(generationTemplate.description, cmd),
            journalLines: generationTemplate.lines.asEnumerable()
                .select(item => ({
                    subsidiaryLedgerAccountId: item.subsidiaryLedgerAccountId,
                    detailAccountId: this._render(item.detailAccountId, cmd) || null,
                    article: this._render(item.article, cmd),
                    debtor: parseInt(this._render(item.debtor, cmd)),
                    creditor: parseInt(this._render(item.creditor, cmd))
                }))
                .where(item => (item.debtor + item.creditor) !== 0)

                .orderByDescending(item => item.debtor)

                .toArray()
        };

        return journal;
    }

    _render(template, model) {
        return _.template(template)(model);
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