export default function branchChooseController($scope,branchApi, $cookies, navigate) {
    "use strict";

    this.branches = [];
    this.selectedBranch = {};

    branchApi.my().then(result=> this.branches = result);

    this.select = branch => {
        this.selectedBranch = branch;
        $cookies.put('branch-id', branch.id);
        $scope.$emit('branch-changed', branch);
        navigate('home');
    };
}