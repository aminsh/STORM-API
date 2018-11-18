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

    createCustomTemplate(sourceType, cmd) {

        cmd.name = sourceType;

        const errors = this._validateCustomTemplate(cmd);

        if (errors.length > 0)
            throw new ValidationException(errors);

        const entity = {
            title: cmd.title,
            data: cmd.data,
            fields: cmd.fields
        };

        return this.journalGenerationTemplateRepository.create(sourceType, entity);
    }

    _validateCustomTemplate(cmd) {

        let errors = [];

        if (!cmd.name)
            errors.push('نام قالب وارد نشده');

        if (!cmd.title)
            errors.push('عنوان قالب وارد نشده');

        if (!cmd.fields)
            errors.push('فیلدهای قالب وارد نشده');
        else {

            let err = this._validateCustomTemplateField(cmd.fields);

            errors.concat(err);
        }

        return errors;
    }

    _validateCustomTemplateField(fields) {

        let errors = [];

        const complexType = ['Array', 'Object'];

        fields.forEach(field => {

            if(!field.type) {
                errors.push('نوع فیلد مشخص نشده');
                return;
            }

            if(complexType.includes(field.type))
                errors.concat(this._validateCustomTemplateField(field.fields));
            else {
                if(!field.key)
                    errors.push('کلید فیلد مشخص نشده');
            }
        });
    }
}
