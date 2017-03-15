export default class ContactUs {
    constructor($http, setDirty) {
        this.contactUsModel = {
            name: '',
            email: '',
            phone: '',
            message: ''
        };

        this.$http = $http;
        this.setDirty = setDirty;
        this.result = {isValid: false};

    }

    send(form) {
        if (form.$invalid) {
            return this.setDirty(form);
        }

        this.$http.post('/api/send-message', this.contactUsModel)
            .then(result => this.result = result.data);
    }
}

ContactUs.$inject = ['$http', 'setDirty'];