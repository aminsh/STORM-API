import {inject, injectable} from "inversify";

@injectable()
export class PayableChequeCategoryDomainService {

    @inject("ChequeCategoryRepository") chequeCategoryRepository = undefined;

    @inject("DetailAccountRepository") detailAccountRepository = undefined;

    @inject("PayableChequeDomainService") payableChequeDomainService = undefined;

    create(cmd) {

        let errors = [];

        if (!cmd.bankId)
            errors.push('بانک مقدار ندارد');
        else {
            let bank = this.detailAccountRepository.findById(cmd.bankId);

            if (!bank)
                return errors.push('بانک صحیح نیست');

            if (bank.detailAccountType !== 'bank')
                return errors.push('بانک صحیح نیست');
        }

        if (!cmd.totalPages)
            errors.push('تعداد برگ مقدار ندارد');

        if (!cmd.firstPageNumber)
            errors.push('از شماره مقدار ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            bankName: cmd.bankName,
            bankId: cmd.bankId,
            isClosed: false,
            receiveDate: cmd.receiveDate
        };

        this._calculateLastPageNumber(cmd, entity);

        this.chequeCategoryRepository.create(entity);
    }

    update(id, cmd) {

        let errors = [];

        if (!cmd.bankId)
            errors.push('بانک مقدار ندارد');
        else {
            let bank = this.detailAccountRepository.findById(cmd.bankId);

            if (!bank)
                return errors.push('بانک صحیح نیست');

            if (bank.detailAccountType !== 'bank')
                return errors.push('بانک صحیح نیست');
        }

        let category = this.chequeCategoryRepository.findById(id);

        if (!category)
            throw new ValidationException(['دسته چک وجود ندارد']);

        if (this._isNumbersChanged(cmd, category) && category.cheques.asEnumerable().any(item => item.isUsed))
            errors.push('از چک های دسته چک جاری استفاده شده ، امکان تغییر در شماره ها و تعداد برگ های چک وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            bankId: cmd.bankId,
            bankName: cmd.bankName,
            receiveDate: cmd.receiveDate
        };

        if (this._isNumbersChanged(cmd, category))
            this._calculateLastPageNumber(cmd, entity);

        this.chequeCategoryRepository.update(id, entity);
    }


    remove(id) {

        let entity = this.chequeCategoryRepository.findById(id);

        if (!entity)
            throw new ValidationException(['دسته چک وجود ندارد']);

        if (entity.cheques && entity.cheques.asEnumerable().any(e => e.isUsed))
            throw new ValidationException(['چک های دسته چک جاری استفاده شده ، امکان حذف وجود ندارد']);

        this.chequeCategoryRepository.remove(id);
    }

    _calculateLastPageNumber(cmd, entity) {

        let firstPageNumber = cmd.firstPageNumber || entity.firstPageNumber,
            totalPages = cmd.totalPages || entity.totalPages,
            lastPageNumber = firstPageNumber + totalPages - 1;

        Object.assign(entity, {firstPageNumber, lastPageNumber, totalPages});

        this.payableChequeDomainService.generateFromCategory(entity);

        entity.cheques = JSON.stringify(entity.cheques);
    }

    _isNumbersChanged(cmd, entity) {
        if (!entity) return true;

        if (cmd.firstPageNumber !== entity.firstPageNumber)
            return true;

        if (cmd.totalPages !== entity.totalPages)
            return true;

        return false;
    }
}