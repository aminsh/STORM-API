"use strict";

export default function ($stateProvider, $urlRouterProvider, $locationProvider, $qProvider) {
    $qProvider.errorOnUnhandledRejections(false);

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            controller: 'homeController',
            templateUrl: 'partials/views/home.html'
        })

        .state('settings', {
            url: '/settings',
            controller: 'settingsController',
            controllerAs: 'model',
            templateUrl: 'partials/settings/settings.html'
        })

        .state('chooseBranch', {
            url: '/branch/choose',
            controller: 'chooseBranchController',
            controllerAs: 'model',
            templateUrl: 'partials/branch/branch.choose.html'
        })

        .state('branchInfo', {
            url: '/branch-info',
            controller: 'branchInfoController',
            controllerAs: 'model',
            templateUrl: 'partials/branch/branchInfo.html'
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
        .state('detail-account-categories', {
            url: '/detail-account-categories',
            controller: 'detailAccountCategoriesController',
            controllerAs: 'model',
            templateUrl: 'partials/detailAccount/detailAccountCategories.html'
        })
        .state('detail-account-categories.create', {
            url: '/',
            onEnter: ($modelFactory, $stateParams) => {
                $modelFactory.create({
                    controller: 'detailAccountCategoryEntryController',
                    controllerAs: 'model',
                    templateUrl: 'partials/detailAccount/detailAccountCategoryEntry.html',
                    resolve: {data: () => $stateParams}
                });
            }
        })
        .state('detail-account-categories.edit', {
            url: '/:id',
            onEnter: ($modelFactory, $stateParams) => {
                $modelFactory.create({
                    controller: 'detailAccountCategoryEntryController',
                    controllerAs: 'model',
                    templateUrl: 'partials/detailAccount/detailAccountCategoryEntry.html',
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

        .state('journals.list.detail', {
            url: '/detail/:id',
            onEnter: ($modelFactory, $stateParams) => {
                $modelFactory.create({
                    controller: 'showJournalDetailController',
                    templateUrl: 'partials/modals/showJournalDetail.html',
                    size: 'lg',
                    resolve: {data: () => $stateParams}
                });
            }
        })

        .state('journals.edit', {
            url: '/:id/edit',
            controller: 'journalUpdateController',
            controllerAs: 'model',
            templateUrl: 'partials/journal/journal.html'
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
        .state('fiscal-periods', {
            url: '/fiscal-periods',
            controller: 'fiscalPeriodController',
            controllerAs: 'model',
            templateUrl: 'partials/fiscalPeriod/fiscalPeriods.html'
        })
        .state('fiscal-periods.new', {
            url: '/new',
            onEnter: $modelFactory => {
                $modelFactory.create({
                    controller: 'createFiscalPeriodController',
                    controllerAs: 'model',
                    templateUrl: 'partials/fiscalPeriod/createFiscalPeriod.html'
                });
            }
        })
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
            templateUrl: 'partials/report/reportPrint.html',
            resolve: {
                loadingStimulScript: (reportLoaderService) => {
                    return reportLoaderService.loadIfNot()
                }
            }
        })
        .state('report.design', {
            url: '/design/:key',
            controller: 'reportDesignController',
            controllerAs: 'model',
            templateUrl: 'partials/report/reportDesign.html',
            resolve: {
                loadingStimulScript: (reportLoaderService) => {
                    return reportLoaderService.loadIfNot()
                }
            }
        })
        .state('sales', {
            url: '/sales',
            template: '<ui-view></ui-view>'
        })
        .state('sales.list', {
            url: '/list',
            controller: 'invoiceListController',
            controllerAs: 'model',
            templateUrl: 'partials/sales/list.html'
        })
        .state('sales.create', {
            url: '/create',
            controller: 'invoiceController',
            controllerAs: 'model',
            templateUrl: 'partials/sales/invoiceCreate.html'
        })
        .state('sales.edit', {
            url: '/:id/edit',
            controller: 'invoiceController',
            controllerAs: 'model',
            templateUrl: 'partials/sales/invoiceCreate.html'
        })
        .state('sales.view', {
            url: '/:id/view',
            controller: 'invoiceController',
            controllerAs: 'model',
            templateUrl: 'partials/sales/invoice.html'
        })
        .state('payment', {
            url: '/payment',
            onEnter: ($modelFactory, $stateParams) => {
                $modelFactory.create({
                    controller: 'paymentController',
                    controllerAs: 'model',
                    size: 'lg',
                    templateUrl: 'partials/payment/payment.html',
                    resolve: {data: {amount: $stateParams.amount}}
                });
            }
        })

        .state('purchases', {
            url: '/purchases',
            template: '<ui-view></ui-view>'
        })
        .state('purchases.list', {
            url: '/list',
            controller: 'invoiceListController',
            controllerAs: 'model',
            templateUrl: 'partials/sales/list.html'
        })
        .state('purchases.create', {
            url: '/create',
            controller: 'invoiceController',
            controllerAs: 'model',
            templateUrl: 'partials/sales/invoiceCreate.html'
        })
        .state('purchases.edit', {
            url: '/:id/edit',
            controller: 'invoiceController',
            controllerAs: 'model',
            templateUrl: 'partials/sales/invoiceCreate.html'
        })
        .state('purchases.view', {
            url: '/:id/view',
            controller: 'invoiceController',
            controllerAs: 'model',
            templateUrl: 'partials/sales/invoice.html'
        })

        .state('people', {
            url: '/people',
            controller: 'peopleListController',
            controllerAs: 'model',
            templateUrl: 'partials/people/peopleList.html'
        })
        .state('people.create', {
            url: '/create',
            onEnter: $modelFactory => {
                $modelFactory.create({
                    controller: 'peopleCreateController',
                    controllerAs: 'model',
                    templateUrl: 'partials/people/peopleCreate.html',
                    resolve: {data: () => ({})}
                });
            }
        })
        .state('people.edit', {
            url: '/:id/edit',
            onEnter: ($modelFactory, $stateParams) => {
                $modelFactory.create({
                    controller: 'peopleCreateController',
                    controllerAs: 'model',
                    templateUrl: 'partials/people/peopleCreate.html',
                    resolve: {data: () => $stateParams}
                });
            }
        })
        .state('people.info', {
            url: '/:id/info',
            onEnter: ($modelFactory, $stateParams) => {
                $modelFactory.create({
                    controller: 'peopleMoreInfoController',
                    controllerAs: 'model',
                    templateUrl: 'partials/people/peopleMoreInfo.html',
                    size: 'lg',
                    resolve: {data: () => $stateParams}
                });
            }
        })

        .state('funds', {
            url: '/funds',
            controller: 'fundListController',
            controllerAs: 'model',
            templateUrl: 'partials/fund/fundList.html'
        })

        .state('bankAndFund', {
            url: '/banks-and-funds',
            controller: 'banksAndFundsController',
            controllerAs: 'model',
            templateUrl: 'partials/bankAndFund/bankAndFund.html'
        })
        .state('bankAndFund.bankCreate', {
            url: '/bank/create',
            onEnter: $modelFactory => {
                $modelFactory.create({
                    controller: 'bankCreateController',
                    controllerAs: 'model',
                    templateUrl: 'partials/bank/bankCreate.html'
                });
            }
        })
        .state('bankAndFund.bankEdit', {
            url: '/bank/:id/edit',
            onEnter: $modelFactory => {
                $modelFactory.create({
                    controller: 'bankCreateController',
                    controllerAs: 'model',
                    templateUrl: 'partials/bank/bankCreate.html',
                });
            }
        })

        .state('bankAndFund.fundCreate', {
            url: '/fund/create',
            onEnter: $modelFactory => {
                $modelFactory.create({
                    controller: 'fundCreateController',
                    controllerAs: 'model',
                    templateUrl: 'partials/fund/fundCreate.html'
                });
            }
        })
        .state('bankAndFund.fundEdit', {
            url: '/fund/:id/edit',
            onEnter: $modelFactory => {
                $modelFactory.create({
                    controller: 'fundCreateController',
                    controllerAs: 'model',
                    templateUrl: 'partials/fund/fundCreate.html',
                });
            }
        })

        .state('bankAndFund.info', {
            url: '/:id/:type/info',
            onEnter: ($modelFactory, $stateParams) => {
                $modelFactory.create({
                    controller: 'bankMoreInfoController',
                    size: 'lg',
                    controllerAs: 'model',
                    templateUrl: 'partials/bank/bankMoreInfo.html',
                    resolve: {
                        data: {
                            id: $stateParams.id,
                            title: $stateParams.title,
                            type: $stateParams.type
                        }
                    },
                });
            }
        })
        .state('bank', {
            url: '/bank',
            controller: 'bankListController',
            controllerAs: 'model',
            templateUrl: 'partials/bank/bankList.html'
        })

        .state('products', {
            url: '/products',
            controller: 'productsController',
            controllerAs: 'model',
            templateUrl: 'partials/product/products.html'
        })
        .state('products.create', {
            url: '/create',
            onEnter: $modelFactory => {
                $modelFactory.create({
                    controller: 'productEntryController',
                    controllerAs: 'model',
                    templateUrl: 'partials/product/product.entry.html',
                    resolve: {data: {}}
                });
            }
        })
        .state('products.edit', {
            url: '/:id/edit',
            onEnter: ($modelFactory, $stateParams) => {
                $modelFactory.create({
                    controller: 'productEntryController',
                    controllerAs: 'model',
                    templateUrl: 'partials/product/product.entry.html',
                    resolve: {data: {id: $stateParams.id}}
                });
            }
        })
        .state('products.info', {
            url: '/:id/info',
            /*onEnter: ($modelFactory, $stateParams) => {
             $modelFactory.create({
             controller: 'ProductMoreInfoController',
             controllerAs: 'model',
             size: 'lg',
             templateUrl: 'partials/product/productMoreInfo.html',
             resolve: {data: {id: $stateParams.id}},
             });
             }*/
            controller: 'ProductMoreInfoController',
            controllerAs: 'model',
            templateUrl: 'partials/product/productMoreInfo.html'
        })
        .state('transferMoney', {
            url: '/transfer-money',
            controller: 'transferMoneyController',
            controllerAs: 'model',
            templateUrl: 'partials/financialOperations/transferMoney.html'
        })
        .state('receivableCheques', {
            url: '/receivable-cheques',
            controller: 'receivableChequesController',
            controllerAs: 'model',
            templateUrl: 'partials/receivableCheque/receivableCheques.html'
        })
        .state('payableCheques', {
            url: '/payable-cheques',
            controller: 'payableChequesController',
            controllerAs: 'model',
            templateUrl: 'partials/payableCheque/payableCheques.html'
        })
        .state('createIncome', {
            url: '/income/create',
            controller: 'createIncomeController',
            controllerAs: 'model',
            templateUrl: 'partials/financialOperations/createIncome.html'
        })
        .state('createExpense', {
            url: '/expense/create',
            controller: 'createExpenseController',
            controllerAs: 'model',
            templateUrl: 'partials/financialOperations/createExpense.html'
        })

        .state('stocks', {
            url: '/stocks',
            controller: 'stocksController',
            controllerAs: 'model',
            templateUrl: 'partials/inventory/stocks.html'
        })
        .state('stocks.create', {
            url: '/create',
            onEnter: $modelFactory => {
                $modelFactory.create({
                    controller: 'stockEntryController',
                    controllerAs: 'model',
                    templateUrl: 'partials/inventory/stockEntry.html',
                    resolve: {data: () => ({})}
                });
            }
        })
        .state('stocks.edit', {
            url: '/edit/:id',
            onEnter: ($modelFactory, $stateParams) => {
                $modelFactory.create({
                    controller: 'stockEntryController',
                    controllerAs: 'model',
                    templateUrl: 'partials/inventory/stockEntry.html',
                    resolve: {data: () => ({id: $stateParams.id})}
                });
            }
        })

        .state('inventory', {
            url: '/inventory',
            controller: 'inventoryController',
            controllerAs: 'model',
            templateUrl: 'partials/inventory/inventory.html'
        })
        .state('inventory.stocks', {
            url: '/stocks',
            controller: 'stocksController',
            controllerAs: 'model',
            templateUrl: 'partials/inventory/stocks.html'
        })
        .state('inventory.inputs', {
            url: '/inputs',
            controller: 'inventoriesController',
            controllerAs: 'model',
            templateUrl: 'partials/inventory/inventories.html'
        })
        .state('inventory.inputs.detail', {
            url: '/detail/:id',
            onEnter: ($modelFactory, $stateParams) => {
                $modelFactory.create({
                    controller: 'inventoryDetailController',
                    controllerAs: 'model',
                    size: 'lg',
                    templateUrl: 'partials/inventory/inventoryDetail.html',
                    resolve: {data: {id: $stateParams.id}}
                });
            }
        })
        .state('inventory.outputs', {
            url: '/outputs',
            controller: 'inventoriesController',
            controllerAs: 'model',
            templateUrl: 'partials/inventory/inventories.html'
        })
        .state('inventory.outputs.detail', {
            url: '/detail/:id',
            onEnter: ($modelFactory, $stateParams) => {
                $modelFactory.create({
                    controller: 'inventoryDetailController',
                    controllerAs: 'model',
                    size: 'lg',
                    templateUrl: 'partials/inventory/inventoryDetail.html',
                    resolve: {data: {id: $stateParams.id}}
                });
            }
        })

        .state('not-found', {
            url: '/not-found',
            templateUrl: 'partials/views/notFound.html'
        });
}