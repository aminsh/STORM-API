

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
            onEnter: ($window) => {
               $window.location.href = $window.location.origin;
            }
        })
        .state('aboutus', {
            url: '/about-us',
            templateUrl: 'app/ourTeam/aboutus.html',//require('./home/aboutus.html'),
            controller: 'AboutUSController',
            controllerAs: 'VM'
        })
        .state('pricing', {
            url: '/product/pricing',
            templateUrl: 'app/product/pricing.html',//require('./home/pricing.html'),
            controller: 'PricingController',
            controllerAs: 'VM'
        })
        .state('order', {
            url: '/order/:plan',
            templateUrl: 'app/product/order.html',//require('./auth/register.html'),
/*            controller: 'orderController',
            controllerAs: 'vm'*/
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
            controllerAs: 'model'
        })
        .state('activateUser', {
            url: '/activate/:token',
            onEnter: (logger, translate , $state) => {
                logger.success(translate('Your Account activated successfully'))
                    .then(()=> $state.go('profile'));
            }
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'app/profile/profile.html',//require('./auth/register.html'),
            controller: 'ProfileController',
            controllerAs: 'model',
            shouldAuthenticate: true
        })
        .state('contactUs', {
            url: '/contact-us',
            templateUrl: 'app/contactUs/contactUs.html',//require('./auth/register.html'),
            controller: 'ContactUsController',
            controllerAs: 'vm'
        })

        .state('setup', {
            url: '/setup',
            template: '<ui-view></ui-view>',
            shouldAuthenticate: true
        })
        .state('setup.info', {
            url: '/info',
            templateUrl: 'app/branch/setup-info.html',
            controller: 'SetupInfoController',
            controllerAs: 'model',
            shouldAuthenticate: true
        })
        .state('setup.infoSuccess', {
            url: '/success',
            onEnter: (logger, translate , $state) => {
                logger.success(translate('با تشکر از شما . بزودی با شما تماس خواهیم گرفت'))
                    .then(()=> $state.go('profile'));
            }
        })
        .state('setup.fiscalPeriod', {
            url: '/first-fiscal-period',
            templateUrl: 'app/branch/setup-firstFiscalPeriod.html',
            controller: 'SetupFirstPeriodController',
            controllerAs: 'model',
            shouldAuthenticate: true
        })
        .state('setup.chartOfAccounts', {
            url: '/chart-of-accounts',
            templateUrl: 'app/branch/setup-chartOfAccounts.html',
            controller: 'SetupChartOfAccountsController',
            controllerAs: 'model',
            shouldAuthenticate: true
        })
        .state('setup.final', {
            url: '/final',
            onEnter: ($window) => {
                $window.location.href = `${$window.location.origin}/acc`;
            },
            shouldAuthenticate: true
        })

        .state('/page-not-found', {
            template: '<h1>Page not found</h1>'
        });
}


