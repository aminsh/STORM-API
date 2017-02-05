import accModule from '../acc.module';

accModule.config(($routeProvider, $locationProvider) => {

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $locationProvider.hashPrefix('!');
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
        .when('/journal/copy', {
            controller: 'journalCopyController',
            templateUrl: 'partials/views/journalCopy.html'
        })
        .when('/journal-templates', {
            controller: 'journalTemplatesController',
            templateUrl: 'partials/views/journalTemplates.html'
        })
        .when('/journal/:id/edit', {
            controller: 'journalUpdateController',
            templateUrl: 'partials/views/journalUpdate.html'
        })
        .when('/journal/:id/print', {
            controller: 'journalPrintController',
            templateUrl: 'partials/views/journalPrint.html'
        })
        .when('/journal-management', {
            controller: 'journalManagementController',
            templateUrl: 'partials/views/journalManagement.html'
        })
        .when('/not-found', {
            templateUrl: 'partials/views/notFound.html'
        })
        .when('/cheque-categories', {
            controller: 'chequeCategoriesController',
            templateUrl: 'partials/views/chequeCategories.html'
        })
        .when('/cheque/:id/print', {
            controller: 'chequePrintController',
            templateUrl: 'partials/views/chequePrint.html'
        })
        .when('/banks', {
            controller: 'banksController',
            templateUrl: 'partials/views/banks.html'
        })
        .when('/account-review', {
            controller: 'accountReviewController',
            templateUrl: 'partials/views/accountReview.html'
        })
        .when('/account-review/turnover/:name', {
            controller: 'accountReviewTurnoverController',
            templateUrl: 'partials/views/accountReviewTurnover.html'
        })
        .when('/fiscal-period/new', {
            controller: 'createFiscalPeriodController',
            templateUrl: 'partials/views/createFiscalPeriod.html'
        })
        .when('/reports', {
            controller: 'reportController',
            templateUrl: 'partials/views/report.html'
        })
        .when('/reports/designer/:fileName?', {
            controller: 'reportDesignerController',
            templateUrl: 'partials/views/reportDesigner.html'
        })
        .otherwise('/not-found');
});

accModule.run($route => $route.reload());