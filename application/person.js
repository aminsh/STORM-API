"use strict";

const DetailAccountService = require('./detailAccount'),
    String = instanceOf('utility').String,
    SettingsRepository = require('./data').SettingsRepository,
    InvoiceRepository = require('./data').InvoiceRepository;

class PersonService {
    constructor(branchId) {
        this.branchId = branchId;
        this.detailAccountService = new DetailAccountService(branchId);
    }

    create(cmd){
        cmd.detailAccountType = 'person';

        return this.detailAccountService.create(cmd);
    }

    update(id , cmd){
        this.detailAccountService.update(id, cmd);
    }

    remove(id){
        let errors = [];

        if(new InvoiceRepository(this.branchId).isExistsCustomer(id))
            errors.push('شخص جاری در فاکتور ها استفاده شده ، امکان حذف وجود ندارد');

        if(errors.length > 0)
            throw new ValidationException(errors);

        this.detailAccountService.remove(id);
    }
}

module.exports = PersonService;