export default class peopleCreateController {
    constructor($scope,$rootScope,
                $uibModalInstance,
                formService,
                peopleApi,
                logger,
                devConstants,
                $state, data, confirmWindowClosing) {

        this.confirmWindowClosing = confirmWindowClosing;
        this.confirmWindowClosing.activate();

        this.$scope = $scope;
        this.$rootScope = $rootScope;
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
            title: data.title,
            address: '',
            postalCode:'',
            province: '',
            city: '',
            phone: '',
            mobile: '',
            registrationNumber: '',
            nationalCode: '',
            economicCode: '',
            email: '',
            personType: 'real',
            referenceId:null,
            contacts: []
        };
        this.personType = devConstants.enums.PersonType().data;
        this.editMode = false;

        this.id = data.id;

        if (this.id !== undefined)
            this.editMode = true;

        if (this.editMode) {
            peopleApi.getById(this.id)
                .then(result => this.people = result);
        }
    }

    addContact(){
        this.people.contacts = this.people.contacts || [];

        this.people.contacts.push({
            value: '',
            description: ''
        });
    }

    removeContact(item){
        this.people.contacts.asEnumerable()
            .remove(item);
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
                .then(() => {
                    logger.success();
                    this.$rootScope.$broadcast('onPersonChanged');
                    this.$scope.$close();
                    this.confirmWindowClosing.deactivate();
                })
                .catch(err => this.errors = err)
                .finally(() => this.isSaving = false);
        } else {
            return this.peopleApi.create(people)
                .then(result => {
                    logger.success();
                    this.$rootScope.$broadcast('onPersonChanged');
                    this.$scope.$close(result);
                    this.confirmWindowClosing.deactivate();
                })
                .catch(err => this.errors = err)
                .finally(() => this.isSaving = false);
        }


    }

    close() {
        this.$uibModalInstance.dismiss();
        this.confirmWindowClosing.deactivate();
    }
}
