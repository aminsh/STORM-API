import accModule from '../acc.module';

accModule.config(($routeProvider, $locationProvider) => {

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $locationProvider.hashPrefix('!');
    $routeProvider
        .when('/acc', {
            controller: 'homeController',
            templateUrl: 'partials/views/home.html'
        })
        .when('/acc/general-ledger-accounts', {
            controller: 'generalLedgerAccountsController',
            templateUrl: 'partials/views/generalLedgerAccounts.html'
        })
        .when('/acc/luca/subsidiary-ledger-accounts/:generalLedgerAccountId', {
            controller: 'subsidiaryLedgerAccountsController',
            templateUrl: 'partials/views/subsidiaryLedgerAccounts.html'
        })
        .when('/acc/subsidiary-ledger-account/:generalLedgerAccountId/create', {
            controller: 'subsidiaryLedgerAccountCreateController',
            templateUrl: 'partials/views/subsidiaryLedgerAccountCreate.html'
        })
        .when('/acc/subsidiary-ledger-account/:id/edit', {
            controller: 'subsidiaryLedgerAccountUpdateController',
            templateUrl: 'partials/views/subsidiaryLedgerAccountUpdate.html'
        })
        .when('/acc/detail-accounts', {
            controller: 'detailAccountsController',
            templateUrl: 'partials/views/detailAccounts.html'
        })
        .when('/acc/detail-account/create', {
            controller: 'detailAccountCreateController',
            templateUrl: 'partials/views/detailAccountCreate.html'
        })
        .when('/acc/detail-account/:id/edit', {
            controller: 'detailAccountUpdateController',
            templateUrl: 'partials/views/detailAccountUpdate.html'
        })
        .when('/acc/dimensions', {
            controller: 'dimensionsController',
            templateUrl: 'partials/views/dimensions.html'
        })
        .when('/acc/journals', {
            controller: 'journalsController',
            templateUrl: 'partials/views/journals.html'
        })
        .when('/acc/journal/copy', {
            controller: 'journalCopyController',
            templateUrl: 'partials/views/journalCopy.html'
        })
        .when('/acc/journal-templates', {
            controller: 'journalTemplatesController',
            templateUrl: 'partials/views/journalTemplates.html'
        })
        .when('/acc/journal/:id/edit', {
            controller: 'journalUpdateController',
            templateUrl: 'partials/views/journalUpdate.html'
        })
        .when('/acc/journal/:id/print', {
            controller: 'journalPrintController',
            templateUrl: 'partials/views/journalPrint.html'
        })
        .when('/acc/journal-management', {
            controller: 'journalManagementController',
            templateUrl: 'partials/views/journalManagement.html'
        })
        .when('/acc/not-found', {
            templateUrl: 'partials/views/notFound.html'
        })
        .when('/luca/cheque-categories', {
            controller: 'chequeCategoriesController',
            templateUrl: 'partials/views/chequeCategories.html'
        })
        .when('/acc/cheque/:id/print', {
            controller: 'chequePrintController',
            templateUrl: 'partials/views/chequePrint.html'
        })
        .when('/acc/banks', {
            controller: 'banksController',
            templateUrl: 'partials/views/banks.html'
        })
        .when('/acc/account-review', {
            controller: 'accountReviewController',
            templateUrl: 'partials/views/accountReview.html'
        })
        .when('/acc/account-review/turnover/:name', {
            controller: 'accountReviewTurnoverController',
            templateUrl: 'partials/views/accountReviewTurnover.html'
        })
        .when('/acc/fiscal-period/new', {
            controller: 'createFiscalPeriodController',
            templateUrl: 'partials/views/createFiscalPeriod.html'
        })
        .when('/acc/reports', {
            controller: 'reportController',
            templateUrl: 'partials/views/report.html'
        })
        .when('/luca/reports/designer/:fileName?', {
            controller: 'reportDesignerController',
            templateUrl: 'partials/views/reportDesigner.html'
        })
        .when('/acc/not-found', {
            templateUrl: 'partials/views/notFound.html'
        })
        .otherwise('/acc/not-found');
});

accModule.run(
    $route => $route.reload());