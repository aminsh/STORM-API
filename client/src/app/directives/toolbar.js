class ToolbarController {
  constructor($mdSidenav, $scope, $rootScope) {
    self.$mdSidenav = $mdSidenav;
    $rootScope.$on("logined", function(evt, data) {
      $scope.currentUser = data.currentUser
      $scope.logined = true;
    })
  }

  openMenu() {
    self.$mdSidenav('right').open();
  }
}

ToolbarController.$inject = ['$mdSidenav', '$scope', "$rootScope"];

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
