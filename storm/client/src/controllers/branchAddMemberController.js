export default function branchAddMemberController(formService, navigate,branchApi,userApi, logger ) {
    "use strict";

    this.selectedUser = null;
    this.email = null;
    this.errors = [];

    this.search = form => {
        logger.success();
        if (form.$invalid)
            return formService.setDirty(form);

        userApi.getByEmail(this.email)
            .then(result => this.selectedUser = result)
    };

    this.add = form => {
        if (form.$invalid)
            return formService.setDirty(form);

        branchApi.addMember(this.selectedUser.id)
            .then(()=> logger.success())
            .catch(err=> this.errors = err);
    };
}