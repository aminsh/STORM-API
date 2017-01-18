(function(){
  'use strict';
  angular.module('app').controller('homeController', homeController);

  function homeController() {
    var vm = this;
    vm.menu = false

    activation();

    function activation() {
      vm.toggleMenu = toggleMenu;
    }

    function toggleMenu() {
      vm.menu = !vm.menu
    }
  }
})()
