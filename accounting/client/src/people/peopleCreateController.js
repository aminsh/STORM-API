export default class peopleCreateController {
    constructor($scope,
                $uibModalInstance,
                formService,
                peopleApi,
                logger,
                devConstants,
                $state,
                data) {

        this.$scope = $scope;
        this.logger = logger;
        this.peopleApi = peopleApi;
        this.$uibModalInstance = $uibModalInstance;
        this.logger = logger;
        this.$state = $state;
        this.devConstants = devConstants;
        this.formService = formService;
        this.errors = [];
        this.isSaving = false;
        this.people = {
            title: data.title || '',
            address: '',
            phone: '',
            registrationNumber: '',
            nationalCode: '',
            economicCode: '',
            email: '',
            personType: null
        };
        this.personType = devConstants.enums.PersonType().data;
        this.editMode = false;

        this.id = $state.params.id;

        if (this.id != undefined)
            this.editMode = true;

        if (this.editMode) {
            peopleApi.getById(this.id)
                .then(result => this.people = result);
        }
    }


    save(form) {
        let logger = this.logger,
            formService = this.formService,
            people = this.people;

        if (form.$invalid) {
            return formService.setDirty(form);
        }

        this.errors.asEnumerable().removeAll();
        this.isSaving = true;

        if (this.editMode) {
            return this.peopleApi.update(this.id, people)
                .then(result => {
                    logger.success();
                    this.$scope.$close();
                })
                .catch(err => this.errors = err)
                .finally(() => this.isSaving = false);
        } else {
            return this.peopleApi.create(people)
                .then(result => {
                    logger.success();
                    this.$scope.$close(result);
                })
                .catch(err => this.errors = err)
                .finally(() => this.isSaving = false);
        }


    }

    close() {
        this.$uibModalInstance.dismiss()
    }
}
