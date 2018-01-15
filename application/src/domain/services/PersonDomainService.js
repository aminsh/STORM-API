import {inject, injectable, named} from "inversify";

@injectable()
export class PersonDomainService {

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {DetailAccountDomainService}*/
    @inject("DetailAccountDomainService")  detailAccountDomainService = undefined;

    create(cmd) {
        cmd.detailAccountType = 'person';

        return this.detailAccountDomainService.create(cmd);
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
}