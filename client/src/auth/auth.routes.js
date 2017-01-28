(function(){
  'use strict';
  angular.module('app').config(routerConfigure);

  routerConfigure.$inject = ["$stateProvider"]

  function routerConfigure($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        views: {
          "content@": {
            templateUrl: '/client/src/auth/login.html',
            controller: 'loginController',
            controllerAs: 'AuthVM',
          }
        },
        resolve: {
          deps: ["$ocLazyLoad", function($ocLazyLoad) {
            return $ocLazyLoad.load([
              "/client/src/auth/login.controller.js"
            ])
          }],
        },
      })
      .state('register', {
        url: '/register',
        views: {
          "content@": {
            templateUrl: '/client/src/auth/register.html',
            controller: 'registerController',
            controllerAs: 'AuthVM',
          }
        },
        resolve: {
          deps: ["$ocLazyLoad", function($ocLazyLoad) {
            return $ocLazyLoad.load([
              "/client/src/auth/register.controller.js"
            ])
          }],
        },
      })
  }
})()
