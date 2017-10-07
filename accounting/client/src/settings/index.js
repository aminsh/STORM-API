import accModule from '../acc.module';
import WebhookEntryController from "./webhookEntryController";


function webhookEntryService(modalBase) {
    return modalBase({
        controller: WebhookEntryController,
        controllerAs: 'model',
        size: 'lg',
        templateUrl: 'partials/settings/webhookEntry.html'
    });
}


accModule
    .controller('webhookEntryController', WebhookEntryController)
    .factory('webhookEntryService', webhookEntryService);