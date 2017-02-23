routing.$inject = ['$stateProvider', '$urlRouterProvider'];

export default function routing($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/',
      template: require('./home/home.html'),
      controller: 'HomeController',
      controllerAs: 'home'
    })
    .state('aboutus', {
      url: '/about-us',
      template: require('./home/aboutus.html'),
      controller: 'AboutUSController',
      controllerAs: 'VM'
    })
    .state('pricing', {
      url: '/product/:type/pricing',
      template: require('./home/pricing.html'),
      controller: 'PricingController',
      controllerAs: 'VM'
    })
    .state('login', {
      url: '/login',
      template: require('./auth/login.html'),
      controller: 'LoginController',
      controllerAs: 'login'
    })
    .state('register', {
      url: '/register',
      template: require('./auth/register.html'),
      controller: 'RegisterController',
      controllerAs: 'registerVM'
    })
}
