import {inject, injectable, named} from "inversify";

@injectable()
export class PersonDomainService {

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {DetailAccountDomainService}*/
    @inject("DetailAccountDomainService")  detailAccountDomainService = undefined;

    /**@type {DetailAccountRepository}*/
    @inject("DetailAccountRepository") personRepository = undefined;

    create(cmd) {
        cmd.detailAccountType = 'person';

        return this.detailAccountDomainService.create(cmd);
    }

    createBatch(peopleDTO) {
        peopleDTO.forEach(item => item.errors = this._validate(item));

        let peopleIds = peopleDTO.asEnumerable()
            .where(item => item.errors.length === 0)
            .select(item => this.create(item))
            .toArray();

        return peopleIds;
    }

    update(id, cmd) {
        this.detailAccountDomainService.update(id, cmd);
    }

    remove(id) {
        let errors = [];

        if (this.invoiceRepository.isExistsCustomer(id))
            errors.push('شخص جاری در فاکتور ها استفاده شده ، امکان حذف وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.detailAccountDomainService.remove(id);
    }

    _validate(cmd, id) {
        let errors = [];

        if (Utility.String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (cmd.title.length < 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (!Utility.String.isNullOrEmpty(cmd.code) && this.personRepository.findByCode(cmd.code, id))
            errors.push('کد تکراری است');

        return errors;
    }
}