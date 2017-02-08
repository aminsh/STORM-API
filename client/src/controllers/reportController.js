import Collection from 'dev.collection';

export default function ($scope, devConstants, dimensionCategoryApi, reportApi, translate) {

    $scope.reports = devConstants.reports;
    $scope.mode = 'view';
    $scope.data = [];
    $scope.selectedReport = false;
    $scope.fileName = false;
    $scope.reportTitle = '';

    $scope.select = report => $scope.selectedReport = report;
    $scope.isActiveFirstTab = true;

    $scope.viewerTabs = [];

    $scope.addViewerTab = () => {
        deactivateAllTab();

        let report = $scope.selectedReport,
            params = resolveFilter($scope.journalSearch);

        reportApi[report.func](params)
            .then(result => {
                $scope.data = result.data;
                $scope.viewerTabs.push({title: report.text, isActive: true, fileName: report.fileName});
            });
    };

    $scope.closeViewerTab = tab => Collection.remove($scope.viewerTabs, tab);

    $scope.design = report => {
        let params = resolveFilter($scope.journalSearch);
        $scope.fileName = report.fileName;
        $scope.reportTitle = report.text;
        reportApi[report.func](params)
            .then(result => {
                $scope.data = result.data;
                $scope.mode = 'design';
            });
    };

    $scope.onExitDesign = () => $scope.mode = 'view';

    $scope.closeDesignerTab = tab => Collection.remove($scope.designerTabs, tab);

    function deactivateAllTab() {
        $scope.isActiveFirstTab = false;
        $scope.viewerTabs.forEach(t => t.isActive = false);
    }

    $scope.execute = () => resolveFilter($scope.journalSearch);
    //search parameter cals

    $scope.journalSearch = {
        title: '',
        minNumber: null,
        maxNumber: null,
        minDate: null,
        maxDate: null,
        generalLedgerAccounts: [],
        subsidiaryLedgerAccounts: [], //combination of generalLedgerAccount and subsidiaryLedgerAccount
        detailAccounts: [],
        dimension1s: [],
        dimension2s: [],
        dimension3s: [],
        dimension4s: [],
        chequeNumbers: [],
        minChequeDate: null,
        maxChequeDate: null,
        chequeDescription: '',
        isNotPeriodIncluded: false
    };

    $scope.generalLedgerAccountOptions = {
        placeholder: translate('Select ...'),
        dataTextField: "display",
        dataValueField: "id",
        valuePrimitive: false,
        autoBind: false,
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: devConstants.urls.generalLedgerAccount.all()
                }
            },
            schema: {
                data: 'data'
            }
        }
    };

    $scope.subsidiaryLedgerAccountOptions = {
        placeholder: translate('Select ...'),
        dataTextField: "account",
        dataValueField: "id",
        valuePrimitive: false,
        autoBind: false,
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: devConstants.urls.subsidiaryLedgerAccount.all()
                }
            },
            schema: {
                data: 'data'
            }
        }
    };

    $scope.dimension1Options = {};
    $scope.dimension2Options = {};
    $scope.dimension3Options = {};

    $scope.detailAccountOptions = {
        placeholder: translate('Select ...'),
        dataTextField: "display",
        dataValueField: "id",
        valuePrimitive: false,
        autoBind: false,
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: devConstants.urls.detailAccount.all()
                }
            },
            schema: {
                data: 'data'
            }
        }
    };

    dimensionCategoryApi.getAll()
        .then((result) => {
            let cats = result.data;
            $scope.dimensionCategories = cats;

            $scope.dimension1Options = dimensionOptionFactory(cats[0].id);
            $scope.dimension2Options = dimensionOptionFactory(cats[1].id);
            $scope.dimension3Options = dimensionOptionFactory(cats[2].id);
        });

    function dimensionOptionFactory(categoryId) {
        return {
            placeholder: translate('Select ...'),
            dataTextField: "display",
            dataValueField: "id",
            valuePrimitive: false,
            autoBind: false,
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: devConstants.urls.dimension.allByCategory(categoryId)
                    }
                },
                schema: {
                    data: 'data'
                }
            }
        };
    }

    $scope.chequeOptions = {
        placeholder: translate('Select ...'),
        dataTextField: "number",
        dataValueField: "id",
        valuePrimitive: true,
        autoBind: false,
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: devConstants.urls.cheque.allUseds()
                }
            },
            schema: {
                data: 'data'
            }
        }
    };

    function resolveFilter(filterData) {

        let instance = angular.extend({}, filterData);

        instance.generalLedgerAccounts = new Collection(filterData.generalLedgerAccounts)
            .asEnumerable()
            .select((g) => g.id)
            .toArray();

        instance.subsidiaryLedgerAccounts = new Collection(filterData.subsidiaryLedgerAccounts)
            .asEnumerable()
            .select((s) => s.id)
            .toArray();

        instance.detailAccounts = new Collection(filterData.detailAccounts)
            .asEnumerable()
            .select((d) => d.id)
            .toArray();

        instance.dimension1s = new Collection(filterData.dimension2s)
            .asEnumerable()
            .select((d) => d.id)
            .toArray();

        instance.dimension2s = new Collection(filterData.dimension2s)
            .asEnumerable()
            .select((d) => d.id)
            .toArray();

        instance.dimension3s = new Collection(filterData.dimension3s)
            .asEnumerable()
            .select((d) => d.id)
            .toArray();

        instance.dimension4s = new Collection(filterData.dimension4s)
            .asEnumerable()
            .select((d) => d.id)
            .toArray();

        instance.chequeNumbers = new Collection(filterData.chequeNumbers)
            .asEnumerable()
            .select((c) => c.id)
            .toArray();


        return instance;
    }

}

