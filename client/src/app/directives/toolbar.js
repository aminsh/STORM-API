class ToolbarController {
  constructor($mdSidenav, $scope, $rootScope, $window) {
    self.$mdSidenav = $mdSidenav;
    let currentUser = $window.document.getElementsByName("currentUser")[0].content
    if(currentUser !== '' && currentUser !== null) {
      $scope.currentUser = currentUser
      $scope.logined = true;
    } else {
      currentUser = $rootScope.currentUser;
      if(currentUser !== '' && currentUser !== null) {
        $scope.currentUser = currentUser
        $scope.logined = true;
      }
    }
  }

  openMenu() {
    self.$mdSidenav('right').open();
  }
}

ToolbarController.$inject = ['$mdSidenav', '$scope', "$rootScope", "$window"];

export default function toolbar() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      class: '@classes',
    },
    link: function ($scope, el, attrs) {
      $scope.toolbar.class = $scope.class;
    },
    template: require('./toolbar.html'),
    controller: ToolbarController,
    controllerAs: 'toolbar'
  }
}
