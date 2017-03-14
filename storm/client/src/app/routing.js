routing.$inject = ['$stateProvider', '$urlRouterProvider'];

export default function routing($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
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
}
