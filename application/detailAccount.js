"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    String = instanceOf('utility').String,
    DetailAccountRepository = require('./data').DetailAccountRepository,
    JournalRepository = require('./data').JournalRepository;

class DetailAccount {

    constructor(branchId) {
        this.branchId = branchId;

        this.detailAccountRepository = new DetailAccountRepository(branchId);
    }

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

        const id = this.create({title: cmd.title, referenceId: cmd.referenceId, detailAccountType: 'person'});

        return {id};
    }

    create(cmd) {

        let errors = [];

        if (String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (cmd.title.length > 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (!String.isNullOrEmpty(cmd.code) && this.detailAccountRepository.findByCode(cmd.code))
            errors.push('کد تکراری است');


        if (errors.length > 0)
            throw new ValidationException(errors);

        if (String.isNullOrEmpty(cmd.code)) {
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

        if (String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (cmd.title.length > 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (!String.isNullOrEmpty(cmd.code) && this.detailAccountRepository.findByCode(cmd.code, id))
            errors.push('کد تکراری است');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            id,
            code: cmd.code,
            title: cmd.title,
            referenceId: cmd.referenceId,
            bank: cmd.bank,
            bankBranch: cmd.bankBranch,
            bankAccountNumber: cmd.bankAccountNumber,
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
            contacts: JSON.stringify(cmd.contacts)
        };

        this.detailAccountRepository.update(entity);
    }

    remove(id) {
        let errors = [];

        if (new JournalRepository(this.branchId).isExistsDetailAccount(id))
            errors.push('حساب تفصیل جاری در اسناد حسابداری استفاده شده ، امکان حذف وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);
    }
}

module.exports = DetailAccount;