import {inject, injectable} from "inversify";

@injectable()
export class AccountCategoryService {

    @inject("AccountCategoryRepository")
    /** @type{AccountCategoryRepository}*/ accountCategoryRepository = undefined;

    @inject("GeneralLedgerAccountRepository")
    /** @type{GeneralLedgerAccountRepository}*/ generalLedgerAccountRepository = undefined;

    create(dto) {

        let errors = [];

        if (this.accountCategoryRepository.findByCode(dto.code))
            errors.push('کد تکراری است');

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.accountCategoryRepository.create({key: dto.code, display: dto.title});
    }

    update(id, dto) {

        let errors = [];

        if (this.accountCategoryRepository.findByCode(dto.code, id))
            errors.push('کد تکراری است');

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.accountCategoryRepository.update(id, {key: dto.code, display: dto.title});
    }

    remove(id) {
        let category = this.accountCategoryRepository.findById(id);

        if (!category)
            throw new ValidationException(['گروه وارد شده وجود ندارد']);

        let generalLedgerAccounts = this.generalLedgerAccountRepository.findByCategory(category.key);

        if (generalLedgerAccounts && generalLedgerAccounts.length > 0)
            throw new ValidationException(['گروه وارد شده دارای حساب کل است ، امکان حذف وجود ندارد']);

        this.accountCategoryRepository.remove(id);
    }
}