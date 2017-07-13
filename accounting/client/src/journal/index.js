"use strict";

import accModule from '../acc.module';

import {notShouldBeZeroBoth, notShouldHaveValueBoth} from './journalLines.validations';
import remainder from './journalLines.filters';
import journalController from './journal.controller';
import {
    JournalLineAdditionalInformation,
    JournalLineAdditionalInformationModal
} from './journalLines.additionalInfomation';

import JournalTemplateController from './journalTemplate';

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
    .controller('journalLineAdditionalInformationController', JournalLineAdditionalInformation)
    .controller('journalTemplateController', JournalTemplateController)

    .factory('journalLineAdditionalInformation', JournalLineAdditionalInformationModal)
    .factory('journalTemplateService', journalTemplateService)
;
