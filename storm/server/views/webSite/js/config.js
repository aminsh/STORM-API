/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, IdleProvider, $locationProvider) {

    // Configure Idle settings
    IdleProvider.idle(5); // in seconds
    IdleProvider.timeout(120); // in seconds

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $locationProvider.hashPrefix('!');

    $urlRouterProvider.otherwise("/");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider
        .state('landing', {
            url: "/",
            templateUrl: "views/landing.html",
            data: { pageTitle: 'صفحه ی نخست', specialClass: 'landing-page rtls' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/wow/wow.min.js']
                        }
                    ]);
                }
            }
        });
    $stateProvider
         .state('policy', {
            url: "/landing/policy",
            templateUrl: "views/policy.html",
            data: { pageTitle: 'قوانین و مقررات', specialClass: 'landing-page rtls' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/wow/wow.min.js']
                        }
                    ]);
                }
            }
        });
}
angular
    .module('inspinia')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
