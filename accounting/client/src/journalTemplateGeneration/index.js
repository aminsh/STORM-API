import accModule from "../acc.module";

import JournalGenerationTemplateController from './journalGenerationTemplate';
import JournalGenerationTemplateEntryController from './journalGenerationTemplateEntryController';
import JournalGenerationTemplateApi from './journalGenerationTemplateApi';

accModule
    .controller('journalGenerationTemplateController', JournalGenerationTemplateController)
    .controller('journalGenerationTemplateEntryController', JournalGenerationTemplateEntryController)
    .service('journalGenerationTemplateApi', JournalGenerationTemplateApi)
    .config($stateProvider => {
        $stateProvider

            .state('journalTemplateGeneration', {
                url: '/journal-generation-template',
                controller: 'journalGenerationTemplateController',
                controllerAs: 'model',
                templateUrl: 'partials/journalTemplateGeneration/journalGenerationTemplate.html'
            })

            .state('journalTemplateGeneration.edit', {
                url: '/:type',
                controller: 'journalGenerationTemplateEntryController',
                controllerAs: 'model',
                templateUrl: 'partials/journalTemplateGeneration/journalGenerationTemplateEntry.html'
            })
    });