(function(){
  'use strict';
  angular.module('app').config(routerConfigure);

  routerConfigure.$inject = ["$stateProvider", "$urlRouterProvider"]

  function routerConfigure($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise(function($injector) {
      var $state = $injector.get("$state");
      $state.go('home');
    });

    // $stateProvider
    //   .state('dashboard', {
    //       abstract:true,
    //       //views: layoutProvider.extend({}, ["topbar", "sidebar", "footer"])
    //     })
  }
})()
