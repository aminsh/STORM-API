"use strict";

routing.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

export default function routing($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $locationProvider.hashPrefix('!');

    $urlRouterProvider.otherwise('/page-not-found');
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/home/home.html',//require('./home/home.html'),
            controller: 'HomeController',
            controllerAs: 'home'
        })
        .state('aboutus', {
            url: '/about-us',
            templateUrl: 'app/ourTeam/aboutus.html',//require('./home/aboutus.html'),
            controller: 'AboutUSController',
            controllerAs: 'VM'
        })
        .state('pricing', {
            url: '/product/:type/pricing',
            templateUrl: 'app/product/pricing.html',//require('./home/pricing.html'),
            controller: 'PricingController',
            controllerAs: 'VM'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'app/authentication/login.html',//require('./auth/login.html'),
            controller: 'LoginController',
            controllerAs: 'login'
        })
        .state('register', {
            url: '/register',
            templateUrl: 'app/authentication/register.html',//require('./auth/register.html'),
            controller: 'RegisterController',
            controllerAs: 'registerVM'
        })
        .state('contactUs', {
            url: '/contact-us',
            templateUrl: 'app/contactUs/contactUs.html',//require('./auth/register.html'),
            controller: 'ContactUsController',
            controllerAs: 'vm'
        })
        .state('requestLucaDemo', {
            url: '/request-accounting-demo',
            templateUrl: 'app/product/requestLucaDemo.html',//require('./auth/register.html'),
            controller: 'RequestLucaDemoController',
            controllerAs: 'vm'
        })
        .state('/page-not-found', {
            template: '<h1>Page not found</h1>'
        });
}


