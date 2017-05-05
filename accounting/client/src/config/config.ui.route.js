"use strict";

export default function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

    $urlRouterProvider.otherwise('/not-found');

    $stateProvider
        .state('home', {
            url: '/',
            controller: 'homeController',
            templateUrl: 'partials/views/home.html'
        })
        .state('general-ledger-accounts', {
            url: '/general-ledger-accounts',
            controller: 'generalLedgerAccountsController',
            templateUrl: 'partials/views/generalLedgerAccounts.html'
        })
        .state('general-ledger-accounts.create', {
            url: '/create',
            onEnter: $modelFactory => {
                $modelFactory.create({
                    controller: 'generalLedgerAccountCreateModalController',
                    templateUrl: 'partials/modals/generalLedgerAccountCreate.html'
                });
            }
        })
        .state('general-ledger-accounts.edit', {
            url: '/:id/edit',
            onEnter: ($modelFactory, $stateParams) => {
                $modelFactory.create({
                    controller: 'generalLedgerAccountUpdateModalController',
                    templateUrl: 'partials/modals/generalLedgerAccountUpdate.html',
                    resolve: {id: () => $stateParams.id}
                });
            }
        })
        .state('general-ledger-accounts.subsidiary-ledger-accounts', {
            url: '/:generalLedgerAccountId/subsidiary-ledger-accounts'
        })
        .state('general-ledger-accounts.subsidiary-ledger-accounts.create', {
            url: '/create',
            onEnter: ($modelFactory, $stateParams) => {
                $modelFactory.create({
                    controller: 'subsidiaryLedgerAccountEntryModalController',
                    templateUrl: 'partials/modals/subsidiaryLedgerAccountEntry.html',
                    resolve: {data: () => $stateParams}
                });
            }
        })
        .state('general-ledger-accounts.subsidiary-ledger-accounts.edit', {
            url: '/:id/edit',
            onEnter: ($modelFactory, $stateParams) => {
                $modelFactory.create({
                    controller: 'subsidiaryLedgerAccountEntryModalController',
                    templateUrl: 'partials/modals/subsidiaryLedgerAccountEntry.html',
                    resolve: {data: () => $stateParams}
                });
            }
        })
        .state('detail-accounts', {
            url: '/detail-accounts',
            controller: 'detailAccountsController',
            templateUrl: 'partials/views/detailAccounts.html'
        })
        .state('detail-accounts.create', {
            url: '/create',
            onEnter: $modelFactory => {
                $modelFactory.create({
                    controller: 'detailAccountCreateModalController',
                    templateUrl: 'partials/modals/detailAccountCreate.html'
                });
            }
        })
        .state('detail-accounts.edit', {
            url: '/:id/edit',
            onEnter: ($modelFactory, $stateParams) => {
                $modelFactory.create({
                    controller: 'detailAccountUpdateModalController',
                    templateUrl: 'partials/modals/detailAccountUpdate.html',
                    resolve: {data: () => $stateParams}
                });
            }
        })
        .state('dimensions', {
            url: '/dimensions',
            controller: 'dimensionsController',
            templateUrl: 'partials/views/dimensions.html'
        })
        .state('dimensions.create', {
            url: '/category/:categoryId/create',
            onEnter: ($modelFactory, $stateParams) => {
                $modelFactory.create({
                    controller: 'dimensionCreateModalController',
                    templateUrl: 'partials/modals/dimensionCreate.html',
                    resolve: {data: () => $stateParams}
                });
            }
        })
        .state('dimensions.edit', {
            url: '/:id/edit',
            onEnter: ($modelFactory, $stateParams) => {
                $modelFactory.create({
                    controller: 'dimensionUpdateModalController',
                    templateUrl: 'partials/modals/dimensionUpdate.html',
                    resolve: {data: () => $stateParams}
                });
            }
        })
        .state('journals', {
            url: '/journals',
            template: '<ui-view></ui-view>'
        })
        .state('journals.list', {
            url: '/list',
            controller: 'journalsController',
            templateUrl: 'partials/views/journals.html'
        })
        .state('journals.create', {
            url: '/create',
            controller: 'journalUpdateController',
            controllerAs: 'model',
            templateUrl: 'partials/journal/journal.html'
        })
        .state('journals.edit', {
            url: '/:id/edit',
            controller: 'journalUpdateController',
            controllerAs: 'model',
            templateUrl: 'partials/journal/journal.html'
        })
        .state('journalCopy', {
            url: 'journal/copy',
            controller: 'journalCopyController',
            templateUrl: 'partials/views/journalCopy.html'
        })
        .state('/journal-templates', {
            controller: 'journalTemplatesController',
            templateUrl: 'partials/views/journalTemplates.html'
        })
        .state('/journal/:id/print', {
            controller: 'journalPrintController',
            templateUrl: 'partials/views/journalPrint.html'
        })
        .state('journal-management', {
            url: '/journal-management',
            controller: 'journalManagementController',
            templateUrl: 'partials/views/journalManagement.html'
        })
        .state('cheque-categories', {
            url: '/cheque-categories',
            controller: 'chequeCategoriesController',
            templateUrl: 'partials/views/chequeCategories.html'
        })
        .state('cheque-categories.create', {
            url: '/create',
            onEnter: $modelFactory => {
                $modelFactory.create({
                    controller: 'chequeCategoryCreateModalController',
                    templateUrl: 'partials/modals/chequeCategoryCreate.html'
                });
            }
        })
        .state('cheque-categories.edit', {
            url: '/:id/edit',
            onEnter: ($modelFactory, $stateParams) => {
                $modelFactory.create({
                    controller: 'chequeCategoryUpdateModalController',
                    templateUrl: 'partials/modals/chequeCategoryUpdate.html',
                    resolve: {data: () => $stateParams}
                });
            }
        })
        .state('/cheque/:id/print', {
            controller: 'chequePrintController',
            templateUrl: 'partials/views/chequePrint.html'
        })
        .state('banks', {
            url: '/banks',
            controller: 'banksController',
            templateUrl: 'partials/views/banks.html'
        })
        .state('account-review', {
            url: '/account-review',
            controller: 'accountReviewController',
            templateUrl: 'partials/views/accountReview.html'
        })
        .state('account-review-turnover', {
            url: '/account-review/turnover/:name',
            controller: 'accountReviewTurnoverController',
            templateUrl: 'partials/views/accountReviewTurnover.html'
        })
        .state('fiscal-period.new', {
            url: '/fiscal-period/new',
            controller: 'createFiscalPeriodController',
            templateUrl: 'partials/views/createFiscalPeriod.html'
        })
        /*.state('reports', {
            url: '/reports',
            controller: 'reportController',
            templateUrl: 'partials/views/report.html'
        })*/
        .state('report', {
            url: '/report',
            template: '<ui-view></ui-view>'
        })
        .state('report.list', {
            url: '/list',
            controller: 'reportListController',
            controllerAs: 'model',
            templateUrl: 'partials/report/reportList.html'
        })
        .state('report.print', {
            url: '/:key',
            controller: 'ReportPrintController',
            controllerAs: 'model',
            templateUrl: 'partials/report/reportPrint.html'
        })
        .state('report.design', {
            url: '/design/:key',
            controller: 'reportDesignController',
            controllerAs: 'model',
            templateUrl: 'partials/report/reportDesign.html'
        })
        .state('not-found', {
            url: '/not-found',
            templateUrl: 'partials/views/notFound.html'
        });
}