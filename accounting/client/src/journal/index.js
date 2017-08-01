"use strict";

import accModule from '../acc.module';

import {notShouldBeZeroBoth, notShouldHaveValueBoth} from './journalLines.validations';
import remainder from './journalLines.filters';
import journalController from './journal.controller';
import createAccountController from './createAccountController'
import {
    JournalLineAdditionalInformation,
    JournalLineAdditionalInformationModal
} from './journalLines.additionalInfomation';

import JournalTemplateController from './journalTemplate';


function createAccountService(modalBase) {
    return modalBase({
        controller: 'createAccountController',
        controllerAs: 'model',
        templateUrl: 'partials/journal/createAccount.html',
        size: 'lg'
    });
}

function journalTemplateService(modalBase) {
    return modalBase({
        controller: 'journalTemplateController',
        controllerAs: 'model',
        templateUrl: 'partials/journal/journalTemplate.html',
        size: 'lg'
    });
}

accModule
    .directive('notShouldBeZeroBoth', notShouldBeZeroBoth)
    .directive('notShouldHaveValueBoth', notShouldHaveValueBoth)

    .filter('remainder', remainder)

    .controller('journalUpdateController', journalController)
    .controller('createAccountController', createAccountController)
    .controller('journalLineAdditionalInformationController', JournalLineAdditionalInformation)
    .controller('journalTemplateController', JournalTemplateController)
    .factory('createAccountService', createAccountService)
    .factory('journalLineAdditionalInformation', JournalLineAdditionalInformationModal)
    .factory('journalTemplateService', journalTemplateService)
;
