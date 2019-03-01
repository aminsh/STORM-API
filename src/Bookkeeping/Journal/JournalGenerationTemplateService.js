import _ from "lodash";
import { inject, injectable } from "inversify";

_.templateSettings.interpolate = /#([\s\S]+?)#/g;

@injectable()
export class JournalGenerationTemplateService {

    /** @type {JournalGenerationTemplateRepository}*/
    @inject("JournalGenerationTemplateRepository") journalGenerationTemplateRepository = undefined;

    /**@type{JournalGenerationTemplateEngine}*/
    @inject("JournalGenerationTemplateEngine") journalGenerationTemplateEngine = undefined;

    /**@type {JournalService}*/
    @inject("JournalService") journalService = undefined;

    @inject("MapperFactory")
    /**@type {MapperFactory}*/ mapperFactory = undefined;

    @inject("Enums") enums = undefined;


    generate(journalGenerationTemplateId, id, issuer) {

        if(!(issuer && this.enums.JournalIssuer().getKeys().includes(issuer)))
            throw new Error('Issuer is not valid');


        let entity = this.journalGenerationTemplateRepository.findById(journalGenerationTemplateId);

        if (!entity)
            throw new ValidationException([ 'الگوی ساخت سند حسابداری وجود ندارد' ]);

        let template = entity.data;

        const mapper = this.mapperFactory.get(entity.model);

        const journal = this.journalGenerationTemplateEngine.handler(template, mapper.map(id));

        journal.journalLines = journal.journalLines.asEnumerable()
            .where(item => ( item.debtor + item.creditor ) !== 0)
            .toArray();

        journal.issuer = issuer;

        return this.journalService.create(journal);
    }

    create(cmd) {
        let entity = {
            model: cmd.model,
            title: cmd.title,
            data: JSON.stringify(cmd.data),
            //fields: cmd.fields
        };

        this.journalGenerationTemplateRepository.create(entity);

        return entity.id;
    }

    update(id, cmd) {
        let entity = this.journalGenerationTemplateRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        entity.model = cmd.model;
        entity.fields = cmd.fields;
        entity.title = cmd.title;
        entity.data = cmd.data;

        this.journalGenerationTemplateRepository.update(id, entity);
    }

    remove(id) {
        let entity = this.journalGenerationTemplateRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        this.journalGenerationTemplateRepository.remove(id);
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

        const complexType = [ 'Array', 'Object' ];

        fields.forEach(field => {

            if (!field.type) {
                errors.push('نوع فیلد مشخص نشده');
                return;
            }

            if (complexType.includes(field.type))
                errors.concat(this._validateCustomTemplateField(field.fields));
            else {
                if (!field.key)
                    errors.push('کلید فیلد مشخص نشده');
            }
        });
    }
}
