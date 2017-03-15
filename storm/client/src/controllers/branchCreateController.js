export default function branchCreateController(branchApi, formService, navigate) {
    "use strict";

    this.errors = [];
    this.isSaved = false;

    this.branch = {
        name: '',
        logo: '',
        phone: '',
        address: ''
    };

    this.uploadingState = 'none';
    this.imageFileName = '';

    this.uploaded = (response)=> {
        this.uploadingState = 'uploaded';
        this.imageFileName = `/${response.fullName}`;
        this.branch.logo = response.name
    };

    this.uploadAnotherFile = ()=> {
        this.uploadingState = 'none';
        this.branch.logo = '';
    };

    this.create = form => {
        if (form.$invalid)
            return formService.setDirty(form);

        branchApi.create(this.branch)
            .then(()=>this.isSaved = true)
            .catch(err=> this.errors = err);
    };
}