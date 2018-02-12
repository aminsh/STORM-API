import {inject, injectable} from "inversify";

@injectable()
export class DetailAccountDomainService {

    /**@type {DetailAccountRepository}*/
    @inject("DetailAccountRepository") detailAccountRepository = undefined;

    /**@type {JournalRepository}*/
    @inject("JournalRepository") journalRepository = undefined;

    findPersonByIdOrCreate(cmd) {
        if (!cmd)
            return null;

        let entity;

        if (cmd.id) {
            entity = this.detailAccountRepository.findById(cmd.id);

            if (entity) return entity;
        }


        if (cmd.referenceId) {
            entity = this.detailAccountRepository.findByReferenceId(cmd.referenceId);

            if (entity) return entity;
        }

        if (!cmd.title)
            return null;

        const id = this.create(Object.assign({}, cmd, {detailAccountType: 'person'}));

        return {id};
    }

    create(cmd) {

        let errors = [];

        if (Utility.String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (cmd.title.length < 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (!Utility.String.isNullOrEmpty(cmd.code) && this.detailAccountRepository.findByCode(cmd.code))
            errors.push('کد تکراری است');


        if (errors.length > 0)
            throw new ValidationException(errors);

        if (Utility.String.isNullOrEmpty(cmd.code)) {
            let maxCode = this.detailAccountRepository.findMaxCode() || 1000;
            cmd.code = ++maxCode;
        }

        let entity = {
            code: cmd.code,
            title: cmd.title,
            referenceId: cmd.referenceId,
            detailAccountType: cmd.detailAccountType,
            bank: cmd.bank,
            bankBranch: cmd.bankBranch,
            bankAccountNumber: cmd.bankAccountNumber,
            bankAccountCartNumber: cmd.bankAccountCartNumber,
            address: cmd.address,
            postalCode: cmd.postalCode,
            province: cmd.province,
            city: cmd.city,
            phone: cmd.phone,
            fax: cmd.fax,
            nationalCode: cmd.nationalCode,
            email: cmd.email,
            personType: cmd.personType,
            economicCode: cmd.economicCode,
            registrationNumber: cmd.registrationNumber,
            contacts: JSON.stringify(cmd.contacts),
            detailAccountCategoryIds: cmd.detailAccountCategoryIds
                ? cmd.detailAccountCategoryIds.join('|')
                : null
        };

        this.detailAccountRepository.create(entity);

        return entity.id;
    }

    update(id, cmd) {
        let errors = [];

        if (Utility.String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (cmd.title.length < 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (!Utility.String.isNullOrEmpty(cmd.code) && this.detailAccountRepository.findByCode(cmd.code, id))
            errors.push('کد تکراری است');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            id,
            code: cmd.code,
            title: cmd.title,
            detailAccountType: cmd.detailAccountType,
            referenceId: cmd.referenceId,
            bank: cmd.bank,
            bankBranch: cmd.bankBranch,
            bankAccountNumber: cmd.bankAccountNumber,
            bankAccountCartNumber: cmd.bankAccountCartNumber,
            address: cmd.address,
            postalCode: cmd.postalCode,
            province: cmd.province,
            city: cmd.city,
            phone: cmd.phone,
            fax: cmd.fax,
            nationalCode: cmd.nationalCode,
            email: cmd.email,
            personType: cmd.personType,
            economicCode: cmd.economicCode,
            registrationNumber: cmd.registrationNumber,
            contacts: JSON.stringify(cmd.contacts),
            detailAccountCategoryIds: cmd.detailAccountCategoryIds
                ? cmd.detailAccountCategoryIds.join('|')
                : null
        };

        this.detailAccountRepository.update(entity);
    }

    remove(id) {
        let errors = [];

        if (this.journalRepository.isExistsDetailAccount(id))
            errors.push('حساب تفصیل جاری در اسناد حسابداری استفاده شده ، امکان حذف وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.detailAccountRepository.remove(id);
    }
}
