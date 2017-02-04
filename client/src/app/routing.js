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
