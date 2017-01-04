export default function ($routeProvider, $locationProvider, settingsProvider) {
    "use strict";

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $locationProvider.hashPrefix('!');

    $routeProvider
        .when('/', {
            controller: 'homeController',
            controllerAs: 'model',
            templateUrl: 'partials/views/home.html',
            data: {
                requireAuth: false
            }
        })
        .when('/login/:isAuth?', {
            controller: 'loginController',
            controllerAs: 'model',
            templateUrl: 'partials/views/login.html',
            data: {
                requireAuth: false
            }
        })
        .when('/register', {
            controller: 'registerController',
            controllerAs: 'model',
            templateUrl: 'partials/views/register.html',
            data: {
                requireAuth: false
            }
        })
        .when('/register/success/:name', {
            controller: 'registerSuccessController',
            controllerAs: 'model',
            templateUrl: 'partials/views/registerSuccess.html',
            data: {
                requireAuth: false
            }
        })
        .when('/branch/new', {
            controller: 'branchCreateController',
            controllerAs: 'model',
            templateUrl: 'partials/views/branchCreate.html',
            data: {
                requireAuth: true
            }
        })
        .when('/branch/choose/:isAuth?', {
            controller: 'branchChooseController',
            controllerAs: 'model',
            templateUrl: 'partials/views/branchChoose.html',
            data: {
                requireAuth: true
            }
        })
        .when('/branch/member/add', {
            controller: 'branchAddMemberController',
            controllerAs: 'model',
            templateUrl: 'partials/views/branchAddMember.html',
            data: {
                requireAuth: true
            }
        })
        .when('/branch/members', {
            controller: 'branchMembersController',
            controllerAs: 'model',
            templateUrl: 'partials/views/branchMembers.html',
            data: {
                requireAuth: true
            }
        });
}