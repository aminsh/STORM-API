(function(){
  'use strict';
  angular.module('app').config(routerConfigure);

  routerConfigure.$inject = ["$stateProvider"]

  function routerConfigure($stateProvider) {
    $stateProvider
    .state('home', {
        url: '/',
        views: {
          "content@": {
            templateUrl: '/client/src/home/home.html',
            controller: 'homeController',
            controllerAs: 'homeVM',
          }
        },
        resolve: {
          deps: ["$ocLazyLoad", function($ocLazyLoad) {
            return $ocLazyLoad.load([
              "/client/src/home/home.controller.js",
              "/client/content/stylish-porfolio.css"
            ])
          }],
        },
      })
  }
})()
