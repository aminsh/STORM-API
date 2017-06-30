"use strict";

"use strict";

const enums = require('../../shared/enums');

function personAssembler(entity) {
    var viewModel = {
        id: entity.id,
        code: entity.code,
        display: entity.display,
        title: entity.title,
        description: entity.description,
        address: entity.address,
        postalCode: entity.postalCode,
        province: entity.province,
        city: entity.city,
        phone: entity.phone,
        nationalCode: entity.nationalCode,
        economicCode: entity.economicCode,
        email: entity.email,
        personType: entity.personType,
        personTypeDisplay: entity.personType
            ? enums.PersonType().getDisplay(entity.personType)
            : ''
    };

    return viewModel;
}

module.exports = personAssembler;