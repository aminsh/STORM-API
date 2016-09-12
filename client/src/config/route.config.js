import accModule from '../acc.module';

accModule.config($routeProvider => {
    $routeProvider
        .when('/', {
            controller: 'homeController',
            templateUrl: 'partials/views/home.html'
        })
        .when('/general-ledger-accounts', {
            controller: 'generalLedgerAccountsController',
            templateUrl: 'partials/views/generalLedgerAccounts.html'
        })
        .when('/subsidiary-ledger-accounts/:generalLedgerAccountId', {
            controller: 'subsidiaryLedgerAccountsController',
            templateUrl: 'partials/views/subsidiaryLedgerAccounts.html'
        })
        .when('/subsidiary-ledger-account/:generalLedgerAccountId/create', {
            controller: 'subsidiaryLedgerAccountCreateController',
            templateUrl: 'partials/views/subsidiaryLedgerAccountCreate.html'
        })
        .when('/subsidiary-ledger-account/:id/edit', {
            controller: 'subsidiaryLedgerAccountUpdateController',
            templateUrl: 'partials/views/subsidiaryLedgerAccountUpdate.html'
        })
        .when('/detail-accounts', {
            controller: 'detailAccountsController',
            templateUrl: 'partials/views/detailAccounts.html'
        })
        .when('/detail-account/create', {
            controller: 'detailAccountCreateController',
            templateUrl: 'partials/views/detailAccountCreate.html'
        })
        .when('/detail-account/:id/edit', {
            controller: 'detailAccountUpdateController',
            templateUrl: 'partials/views/detailAccountUpdate.html'
        })
        .when('/dimensions', {
            controller: 'dimensionsController',
            templateUrl: 'partials/views/dimensions.html'
        })
        .when('/journals', {
            controller: 'journalsController',
            templateUrl: 'partials/views/journals.html'
        })
        .when('/journal/:id/edit', {
            controller: 'journalUpdateController',
            templateUrl: 'partials/views/journalUpdate.html'
        })
        .when('/journal-line/:journalId/create', {
            controller: 'journalLineCreateController',
            templateUrl: 'partials/views/journalLineCreateOrUpdate.html'
        })
        .when('/journal-line/:id/edit', {
            controller: 'journalLineUpdateController',
            templateUrl: 'partials/views/journalLineCreateOrUpdate.html'
        }).when('/not-found', {
            templateUrl: 'partials/views/notFound.html'
        })
        .when('/cheque-categories', {
            controller: 'chequeCategoriesController',
            templateUrl: 'partials/views/chequeCategories.html'
        })
        .otherwise('/not-found');
});

accModule.run($route => $route.reload());