export default class peopleMoreInfoController {
    constructor($scope,
                $uibModalInstance,
                formService,
                peopleApi,
                devConstants,
                $state, data) {

        this.$scope = $scope;
        this.peopleApi = peopleApi;
        this.$uibModalInstance = $uibModalInstance;
        this.$state = $state;
        this.devConstants = devConstants;
        this.formService = formService;
        // this.people = {
        //     title: data.title,
        //     address: '',
        //     postalCode:'',
        //     province: '',
        //     city: '',
        //     phone: '',
        //     registrationNumber: '',
        //     nationalCode: '',
        //     economicCode: '',
        //     email: '',
        //     personType: null
        // };
        // this.personType = devConstants.enums.PersonType().data;

        this.id = data.id;
            peopleApi.getById(this.id)
                .then(result => this.people = result)
    }

    close() {
        this.$uibModalInstance.dismiss()
    }
}
