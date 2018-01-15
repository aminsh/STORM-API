"use strict";

/**
 * @param {BranchApi} branchApi */
export default class {
    constructor(settingsApi
        , userApi
        , branchApi
        , formService
        , logger
        , devConstants
        , $scope
        , $timeout
        , translate
        , confirm
        , webhookEntryService,
                clipboard) {
        this.settingsApi = settingsApi;
        this.userApi = userApi;
        this.branchApi = branchApi;
        this.formService = formService;
        this.logger = logger;
        this.errors = [];
        this.isSaving = false;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.translate = translate;
        this.confirm = confirm;
        this.webhookEntryService = webhookEntryService;

        this.settings = {};

        this.productOutputCreationMethods = devConstants.enums.ProductOutputCreationMethod().data;

        settingsApi.get().then(result => {
            this.settings = result;
            this.stakeholders = result.stakeholders || [];
            this.subsidiaryLedgerAccounts = result.subsidiaryLedgerAccounts;
        });

        $scope.$watch(
            () => this.settings.canControlInventory,
            newValue => {
                if (!newValue) this.settings.canCreateSaleOnNoEnoughInventory = false;
            });

        this.changeUserPasswordData = {
            currentPassword: null,
            newPassword: null,
            newPasswordConfirm: null,
            errors: []
        };
        this.changeUserImageData = {
            uploaderAddress: null,
            currentImage: null,
            imageName: null,
            errors: []
        };
        this.changeUsersInBranchData = {
            isOwnerUser: false,
            newUserEmail: null,
            branchUsers: [],
            errors: []
        };
        this.urls = {
            getAllBanks: devConstants.urls.bank.getAll(),
            getAllJournalGenerationTemplates: devConstants.urls.journalGenerationTemplate.all(),
            getAllStocks: devConstants.urls.stock.getAll(),
            getAllDetailAccount: devConstants.urls.people.getAll(),
            getAllAccounts: devConstants.urls.subsidiaryLedgerAccount.all()
        };

        this.branchMembersGridOption = {
            columns: [
                {
                    name: 'isOwner',
                    width: '50px',
                    title: '',
                    filterable: false,
                    sortable: false,
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    },
                    template: `<i ng-if="item.isOwner" class="fa fa-star fa-lg text-success"></i>`
                },
                {
                    name: 'image',
                    title: '',
                    filterable: false,
                    sortable: false,
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    },
                    template: `<img class="img-circle" ng-src="{{item.image}}"
                                     style="width: 50px;height: 50px"
                                     alt="member: {{item.name}}"
                                     preload-image
                                     default-image="/public/images/user.png"
                                     fallback-image="/public/images/user.png"/>`
                },
                {
                    name: 'email',
                    title: translate('Email'),
                    type: 'string',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'name',
                    title: translate('Name'),
                    type: 'string',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'token',
                    title: translate('Token'),
                    filterable: false,
                    sortable: false,
                    css: 'text-center giveMeEllipsis',
                    header: {
                        css: 'text-center'
                    },
                    model: {
                        copy: text => clipboard.copyText(text)
                    },
                    template: `<i title="${translate('Copy')}" class="fa fa-copy fa-lg text-success pointer" ng-click="column.model.copy(item.token)"></i>
                                <span title="{{item.token}}" style="font-family: Arial">{{item.token}}</span>`
                },
            ],
            commands: [
                {
                    title: translate('Remove'),
                    icon: 'fa fa-trash text-danger fa-lg',
                    action: current => this.deleteUserFromBranchByEmail(current.email),
                    canShow: current => !current.isOwner
                },
                {
                    title: translate('Regenerate token'),
                    icon: 'fa fa-refresh text-success fa-lg',
                    action: current => this.regenerateToken(current.id)
                }
            ],
            readUrl: '/api/branches/users',
            sort: [
                {dir: 'asc', field: 'isOwner'},
                {dir: 'asc', field: 'id'},
            ]
        }

    }

    save(form) {
        if (form.$invalid)
            return this.formService.setDirty(form);

        this.validateStakeholder();

        this.settings.stakeholders = this.stakeholders;
        this.settings.subsidiaryLedgerAccounts = this.subsidiaryLedgerAccounts;

        this.errors = [];
        this.isSaving = true;

        this.settingsApi.save(this.settings)
            .then(() => this.logger.success())
            .catch(errors => this.errors = errors)
            .finally(() => this.isSaving = false);
    }

    changeUserPassword(form) {
        if (form.$invalid)
            return this.formService.setDirty(form);

        this.errors = [];
        this.isSaving = true;

        this.userApi.savePassword({
            currentPass: this.changeUserPasswordData.currentPassword
            , newPass: this.changeUserPasswordData.newPassword
        })
            .then(() => {
                this.logger.success();
                this.changeUserPasswordData.currentPassword = null;
                this.changeUserPasswordData.newPassword = null;
                this.changeUserPasswordData.newPasswordConfirm = null;
                this.changeUserPasswordData.showChangePassMsg = false;
                this.changeUserPasswordData.errors = [];
                this.$timeout(() => this.formService.setClean(form));
            })
            .catch(errors => {
                this.errors = errors;
                console.log(errors);
                this.changeUserPasswordData.errors = [this.translate("The password is wrong")];
                this.changeUserPasswordData.showChangePassMsg = true;
            })
            .finally(() => this.isSaving = false);
    }

    addStakeholder() {
        this.stakeholders.push({rate: 0});
    }

    removeStakeholder(item) {
        this.stakeholders.asEnumerable().remove(item);
    }

    validateStakeholder() {
        if (this.stakeholders.length === 0)
            return;

        const total = this.stakeholders.asEnumerable()
            .sum(item => item.rate);

        if (total === 100)
            return;

        if (total < 100) {
            this.logger.error('ترکیب سهامدارن کمتر از ۱۰۰ درصد است');
            throw new Error('total rate is smaller than 100');
        }

        this.logger.error('ترکیب سهامدارن بیشتر از ۱۰۰ درصد است');
        throw new Error('total rate is bigger 100');
    }

    onDetailAccountChanged(item, row, form) {
        form.detailAccountId.$setViewValue(item.id);
        row.detailAccountId = item.id;
    }

    onSubsidiaryLedgerAccountChanged(item, row) {
        row.id = item.id;
    }

    changeUserImage(form) {

        if (form.$invalid)
            return this.formService.setDirty(form);

        this.errors = [];
        this.isSaving = true;

        console.log(`new uploaded image: ${this.changeUserImageData.uploaderAddress}`);
        this.userApi.saveImage({
            imageName: this.changeUserImageData.uploaderAddress
        })
            .then(() => {
                this.logger.success();
                this.changeUserImageData.errors = [];
            })
            .catch(errors => {
                this.errors = errors;
                console.log(errors);
                this.changeUserImageData.errors = [this.translate("There is a problem in uploading image")];
            })
            .finally(() => {
                this.isSaving = false;
                this.updateUserImage();
            });

    }

    updateUserImage() {

        let returnValue;
        this.userApi.getImage()
            .then(data => {

                returnValue = (data.isValid) ? data.returnValue : "/public/images/user.png";
                this.changeUserImageData.currentImage = returnValue;

            })
            .catch(error => {

                console.log(error);

            });

    }

    loadUserUploadedImage(fileName) {
        this.changeUserImageData.uploaderAddress = `/${fileName}`.replace(/[\\]/g, "/");
        console.log(this.changeUserImageData.uploaderAddress);
    }

    addUserToBranch(form) {

        if (form.$invalid)
            return this.formService.setDirty(form);

        this.errors = [];
        this.changeUsersInBranchData.errors = [];
        this.isSaving = true;

        this.branchApi
            .addUserByEmail(this.changeUsersInBranchData.newUserEmail)
            .then(data => {

                this.changeUsersInBranchData.newUserEmail = "";

                if (!(data)) {

                    this.logger.success();

                } else if (data === "The user is already in the list") {

                    this.changeUsersInBranchData.errors = [this.translate("The user is already in the list")];

                } else if (data === "This user is the branch owner") {

                    this.changeUsersInBranchData.errors = [this.translate("This user is the branch owner")];

                }

                this.$timeout(() => {
                    this.formService.setClean(form);
                    this.branchMembersGridOption.refresh();
                });

            })
            .catch(error => {

                this.errors = error;
                this.changeUsersInBranchData.errors = [this.translate("No user exists with this email address")];

            })
            .finally(() => {
                this.isSaving = false;
                this.getBranchUsers();
            });

    }

    deleteUserFromBranchByEmail(email) {

        this.confirm(
            this.translate('Are you sure ?'),
            this.translate('Remove Person')
        )
            .then(() => {

                this.branchApi
                    .deleteUserByEmail(email)
                    .then(() => {

                        this.$timeout(() => {
                            this.logger.success();
                            this.branchMembersGridOption.refresh();
                        });

                    })
                    .catch(error => {

                        console.log(error);
                        this.errors = error;

                    })
                    .finally(() => this.getBranchUsers());

            });

    }

    regenerateToken(id) {

        this.confirm(
            this.translate('Are you sure ?'),
            this.translate('Regenerate token')
        )
            .then(() => {
                this.branchApi.regenerateToken(id)
                    .then(() => {
                        this.$timeout(() => this.logger.success(), 500);
                        this.branchMembersGridOption.refresh();
                    })
                    .catch(errors => this.logger.error(errors.join('</br>')));
            });

    }

    addSaleCost() {

        this.settings.saleCosts = this.settings.saleCosts || [];

        this.settings.saleCosts.push({display: ''});
    }

    removeSaleCost(item) {
        this.settings.saleCosts.asEnumerable().remove(item);
    }

    addSaleCharge() {

        this.settings.saleCharges = this.settings.saleCharges || [];

        this.settings.saleCharges.push({display: ''});
    }

    removeSaleCharge(item) {
        this.settings.saleCharges.asEnumerable().remove(item);
    }

    addWebhook() {
        this.settings.webhooks = this.settings.webhooks || [];

        this.webhookEntryService.show()
            .then(result => {
                console.log(result);
                this.settings.webhooks.push(result);
            });
    }

    editWebhook(config) {
        this.webhookEntryService.show({config})
            .then(result => config = result);
    }

    removeWebhook(item) {
        this.settings.webhooks.asEnumerable().remove(item);
    }

}