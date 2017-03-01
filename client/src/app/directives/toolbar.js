class ToolbarController {
  constructor($mdSidenav) {
    self.$mdSidenav = $mdSidenav;
    console.log(self.scope);
  }

  openMenu() {
    console.log('clicked from ToolbarController');
    self.$mdSidenav('right').open();
  }
}

ToolbarController.$inject = ['$mdSidenav'];

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
