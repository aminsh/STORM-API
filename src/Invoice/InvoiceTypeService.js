import { inject, injectable } from "inversify";

@injectable()
export class InvoiceTypeService {

    @inject("InvoiceTypeRepository")
    /**@type{InvoiceTypeRepository}*/
    invoiceTypeRepository = undefined;

    create(invoiceType, DTO) {
        let errors = [];

        if (!invoiceType)
            throw new ValidationException('invoiceType is empty');

        if (Utility.String.isNullOrEmpty(DTO.title))
            errors.push('عنوان نباید خالی باشد');
        else if (DTO.title.length < 3)
            errors.push('عنوان نباید کمتر از 3 کاراکتر باشد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            title: DTO.title,
            invoiceType,
            referenceId: DTO.referenceId,
            journalGenerationTemplateId: DTO.journalGenerationTemplateId,
            returnJournalGenerationTemplateId: DTO.returnJournalGenerationTemplateId
        };

        this.invoiceTypeRepository.create(entity);

        return entity.id;
    }

    update(id, DTO) {
        let errors = [];

        let entity = this.invoiceTypeRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        if (Utility.String.isNullOrEmpty(DTO.title))
            errors.push('عنوان نباید خالی باشد');
        else if (DTO.title.length < 3)
            errors.push('عنوان نباید کمتر از 3 کاراکتر باشد');

        entity.title = DTO.title;
        entity.referenceId = DTO.referenceId;
        entity.journalGenerationTemplateId = DTO.journalGenerationTemplateId;
        entity.returnJournalGenerationTemplateId = DTO.returnJournalGenerationTemplateId;

        this.invoiceTypeRepository.update(id, entity);
    }

    setAsDefault(id) {
        this.invoiceTypeRepository.setAllIsDefaultAsFalse();
        this.invoiceTypeRepository.update(id, { isDefault: true });
    }

    remove(id) {
        this.invoiceTypeRepository.remove(id);
    }
}