routing.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

export default function routing($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $locationProvider.hashPrefix('!');

    $urlRouterProvider.otherwise('/404');
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/home/home.html',//require('./home/home.html'),
            controller: 'HomeController',
            controllerAs: 'home'
        })
        .state('aboutus', {
            url: '/about-us',
            templateUrl: 'app/home/aboutus.html',//require('./home/aboutus.html'),
            controller: 'AboutUSController',
            controllerAs: 'VM'
        })
        .state('pricing', {
            url: '/product/:type/pricing',
            templateUrl: 'app/home/pricing.html',//require('./home/pricing.html'),
            controller: 'PricingController',
            controllerAs: 'VM'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'app/auth/login.html',//require('./auth/login.html'),
            controller: 'LoginController',
            controllerAs: 'login'
        })
        .state('register', {
            url: '/register',
            templateUrl: 'app/auth/register.html',//require('./auth/register.html'),
            controller: 'RegisterController',
            controllerAs: 'registerVM'
        })
        .state('contactUs', {
            url: '/contact-us',
            templateUrl: 'app/home/contactUs.html',//require('./auth/register.html'),
            controller: 'ContactUsController',
            controllerAs: 'vm'
        })
        .state('requestLucaDemo', {
            url: '/request-luca-demo',
            templateUrl: 'app/home/requestLucaDemo.html',//require('./auth/register.html'),
            controller: 'RequestLucaDemoController',
            controllerAs: 'vm'
        })
        .state('/404', {
            template: '<h1>404</h1>'
        });
}
