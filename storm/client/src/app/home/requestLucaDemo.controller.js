export default class RequestLucaDemo {
    constructor($http, setDirty) {
        this.model = {
            name: '',
            email: ''
        };

        this.$http = $http;
        this.setDirty = setDirty;
        this.result = {isValid: false};

    }

    send(form) {
        if (form.$invalid) {
            return this.setDirty(form);
        }

        this.$http.post('/api/request-luca-demo',this.model)
            .then(result => this.result = result.data);
    }
}

RequestLucaDemo.$inject = ['$http', 'setDirty'];