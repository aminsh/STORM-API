"use strict";

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
        , confirm) {
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

        settingsApi.get().then(result => this.settings = result);
        this.updateUserImage();
        this.isBranchOwnerUser()
            .then((isOwner) => {
                if (isOwner) this.getBranchUsers();
            })
            .catch(error => console.log(error));

        $scope.$watch(
            () => this.settings.canControlInventory,
            newValue => {if(!newValue) this.settings.canCreateSaleOnNoEnoughInventory = false;});

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
            getAllJournalGenerationTemplates: devConstants.urls.journalGenerationTemplate.all()
        };

    }

    save(form) {
        if (form.$invalid)
            return this.formService.setDirty(form);
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

    isBranchOwnerUser() {

        return new Promise((resolve, reject) => {

            this.branchApi
                .isOwnerUser()
                .then(data => {

                    this.changeUsersInBranchData.isOwnerUser = data.isValid;
                    resolve(data.isValid);

                })
                .catch(error => {

                    // console.log(error);
                    this.changeUsersInBranchData.isOwnerUser = false;
                    this.errors = error;
                    reject(error);

                });

        });

    }

    getBranchUsers() {

        this.branchApi
            .getBranchUsers()
            .then(data => {

                this.changeUsersInBranchData.branchUsers = data.returnValue;

            })
            .catch(error => {

                console.log(error);
                this.errors = error;

            });

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

                this.$timeout(() => this.formService.setClean(form));

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

                        this.$timeout(() => this.logger.success());

                    })
                    .catch(error => {

                        console.log(error);
                        this.errors = error;

                    })
                    .finally(() => this.getBranchUsers());

            });

    }

}