import Guid from "guid";

class WebhookEntryController {
    constructor($scope,devConstants, data, formService) {

        this.$scope = $scope;
        this.formService = formService;

        this.events = devConstants.enums.NotificationEvent().data.asEnumerable()
            .select(item => ({
                key: item.key,
                display: `${item.key} (${item.display})`,
                fields: item.fields
            }))
            .toArray();

        this.methods = ['POST', 'PUT', 'DELETE'];

        this.config = data && data.config
            ? data.config
            : {
                id: Guid.new(),
                title: '',
                event: '',
                method: 'POST',
                headers: [{key: '', value: ''}],
                mapper: []
            };
    }

    addHeader() {
        this.config.headers.push({key: '', value: ''});
    }

    removeHeader(item) {
        this.config.headers.asEnumerable().remove(item);
    }

    onEventChanged(eventName) {
        if (!eventName)
            this.config.eventDisplay = '';
        else {
            const event = this.events.asEnumerable()
                .single(item => item.key === eventName);

            this.config.mapper = event.fields.asEnumerable()
                .select(item => ({
                    sourceProperty: item.key,
                    sourcePropertyDisplay: `${item.key} (${item.display})`,
                    targetProperty: '',
                    isIncluded: true
                }))
                .toArray();

            this.config.eventDisplay = event.display;
        }

    }

    confirm(form){
        if(form.$invalid){
            this.formService.setDirty(form);
            this.formService.setDirtySubForm(form);
            return;
        }

        this.$scope.$close(this.config);
    }

    close() {
        this.$scope.$dismiss();
    }
}

export default WebhookEntryController;