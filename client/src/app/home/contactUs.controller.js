export default class ContactUs {
    constructor($http, setDirty) {
        this.contactUsModel = {
            name: '',
            email: '',
            phone: '',
            message: ''
        };

        this.setDirty = setDirty;
    }

    send(form) {
        if (form.$invalid) {
            return this.setDirty(form);
        }

        $http.post('/api/send-message', this.contactUsModel)
            .then(result => {

            });
    }
}

ContactUs.$inject = ['$http', 'setDirty'];
