import accModule from '../acc.module';

accModule.config(($routeProvider, $locationProvider) => {

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $locationProvider.hashPrefix('!');
    $routeProvider
        .when('/luca', {
            controller: 'homeController',
            templateUrl: 'partials/views/home.html'
        })
        .when('/luca/general-ledger-accounts', {
            controller: 'generalLedgerAccountsController',
            templateUrl: 'partials/views/generalLedgerAccounts.html'
        })
        .when('/luca/luca/subsidiary-ledger-accounts/:generalLedgerAccountId', {
            controller: 'subsidiaryLedgerAccountsController',
            templateUrl: 'partials/views/subsidiaryLedgerAccounts.html'
        })
        .when('/luca/subsidiary-ledger-account/:generalLedgerAccountId/create', {
            controller: 'subsidiaryLedgerAccountCreateController',
            templateUrl: 'partials/views/subsidiaryLedgerAccountCreate.html'
        })
        .when('/luca/subsidiary-ledger-account/:id/edit', {
            controller: 'subsidiaryLedgerAccountUpdateController',
            templateUrl: 'partials/views/subsidiaryLedgerAccountUpdate.html'
        })
        .when('/luca/detail-accounts', {
            controller: 'detailAccountsController',
            templateUrl: 'partials/views/detailAccounts.html'
        })
        .when('/luca/detail-account/create', {
            controller: 'detailAccountCreateController',
            templateUrl: 'partials/views/detailAccountCreate.html'
        })
        .when('/luca/detail-account/:id/edit', {
            controller: 'detailAccountUpdateController',
            templateUrl: 'partials/views/detailAccountUpdate.html'
        })
        .when('/luca/dimensions', {
            controller: 'dimensionsController',
            templateUrl: 'partials/views/dimensions.html'
        })
        .when('/luca/journals', {
            controller: 'journalsController',
            templateUrl: 'partials/views/journals.html'
        })
        .when('/luca/journal/copy', {
            controller: 'journalCopyController',
            templateUrl: 'partials/views/journalCopy.html'
        })
        .when('/luca/journal-templates', {
            controller: 'journalTemplatesController',
            templateUrl: 'partials/views/journalTemplates.html'
        })
        .when('/luca/journal/:id/edit', {
            controller: 'journalUpdateController',
            templateUrl: 'partials/views/journalUpdate.html'
        })
        .when('/luca/journal/:id/print', {
            controller: 'journalPrintController',
            templateUrl: 'partials/views/journalPrint.html'
        })
        .when('/luca/journal-management', {
            controller: 'journalManagementController',
            templateUrl: 'partials/views/journalManagement.html'
        })
        .when('/luca/not-found', {
            templateUrl: 'partials/views/notFound.html'
        })
        .when('/luca/cheque-categories', {
            controller: 'chequeCategoriesController',
            templateUrl: 'partials/views/chequeCategories.html'
        })
        .when('/luca/cheque/:id/print', {
            controller: 'chequePrintController',
            templateUrl: 'partials/views/chequePrint.html'
        })
        .when('/luca/banks', {
            controller: 'banksController',
            templateUrl: 'partials/views/banks.html'
        })
        .when('/luca/account-review', {
            controller: 'accountReviewController',
            templateUrl: 'partials/views/accountReview.html'
        })
        .when('/luca/account-review/turnover/:name', {
            controller: 'accountReviewTurnoverController',
            templateUrl: 'partials/views/accountReviewTurnover.html'
        })
        .when('/luca/fiscal-period/new', {
            controller: 'createFiscalPeriodController',
            templateUrl: 'partials/views/createFiscalPeriod.html'
        })
        .when('/luca/reports', {
            controller: 'reportController',
            templateUrl: 'partials/views/report.html'
        })
        .when('/luca/reports/designer/:fileName?', {
            controller: 'reportDesignerController',
            templateUrl: 'partials/views/reportDesigner.html'
        })
        .when('/luca/not-found', {
            templateUrl: 'partials/views/notFound.html'
        })
        .otherwise('/luca/not-found');
});

accModule.run(
    $route => $route.reload());