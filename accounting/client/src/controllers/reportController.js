export default function ($scope, devConstants, dimensionCategoryApi, reportApi, $timeout) {

    $scope.reports = devConstants.reports;
    $scope.mode = 'view';
    $scope.data = [];
    $scope.selectedReport = false;
    $scope.fileName = false;
    $scope.reportTitle = '';

    $scope.select = report => $scope.selectedReport = report;
    $scope.isActiveFirstTab = true;
    $scope.activeTabIndex = 0;

    $scope.viewerTabs = [];

    $scope.addViewerTab = () => {
        let report = $scope.selectedReport,
            params = resolveFilter($scope.journalSearch);

        reportApi[report.func](params)
            .then(result => {
                $scope.data = result;
                $scope.viewerTabs.push({title: report.text, isActive: true, fileName: report.fileName});
                $timeout(() => $scope.activeTabIndex = $scope.viewerTabs.length)
            });
    };

    $scope.closeViewerTab = (tab, $event) => {
        $event.preventDefault();

        $scope.viewerTabs.remove(tab);
        $timeout(() => $scope.activeTabIndex = $scope.viewerTabs.length);
    };

    $scope.design = report => {
        let params = resolveFilter($scope.journalSearch);
        $scope.fileName = report.fileName;
        $scope.reportTitle = report.text;

        if (!report.func) {
            $scope.mode = 'design';
            return;
        }

        reportApi[report.func](params)
            .then(result => {
                $scope.data = result;
                $scope.mode = 'design';
            });
    };

    $scope.onExitDesign = () => {
        $scope.mode = 'view';
        $scope.activeTabIndex = 0;
    };

    $scope.closeDesignerTab = tab => {
        $scope.designerTabs.remove(tab);
        $scope.activeTabIndex = 0;
    };

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

    $scope.generalLedgerAccountDataSource = {
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
    };

    $scope.subsidiaryLedgerAccountDataSource = {
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
    };

    $scope.dimension1DataSource = {};
    $scope.dimension2DataSource = {};
    $scope.dimension3DataSource = {};

    $scope.detailAccountDataSource = {
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
    };

    dimensionCategoryApi.getAll()
        .then((result) => {
            let cats = result.data;
            $scope.dimensionCategories = cats;

            $scope.dimension1DataSource = dimensionDataSourceFactory(cats[0].id);
            $scope.dimension2DataSource = dimensionDataSourceFactory(cats[1].id);
            $scope.dimension3DataSource = dimensionDataSourceFactory(cats[2].id);
        });

    function dimensionDataSourceFactory(categoryId) {
        return {
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
        };
    }

    $scope.chequeDataSource = {
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
    };

    function resolveFilter(filterData) {

        let instance = angular.extend({}, filterData);

        instance.generalLedgerAccounts = filterData.generalLedgerAccounts
            .asEnumerable()
            .select((g) => g.id)
            .toArray();

        instance.subsidiaryLedgerAccounts = filterData.subsidiaryLedgerAccounts
            .asEnumerable()
            .select((s) => s.id)
            .toArray();

        instance.detailAccounts = filterData.detailAccounts
            .asEnumerable()
            .select((d) => d.id)
            .toArray();

        instance.dimension1s = filterData.dimension2s
            .asEnumerable()
            .select((d) => d.id)
            .toArray();

        instance.dimension2s = filterData.dimension2s
            .asEnumerable()
            .select((d) => d.id)
            .toArray();

        instance.dimension3s = filterData.dimension3s
            .asEnumerable()
            .select((d) => d.id)
            .toArray();

        instance.dimension4s = filterData.dimension4s
            .asEnumerable()
            .select((d) => d.id)
            .toArray();

        instance.chequeNumbers = filterData.chequeNumbers
            .asEnumerable()
            .select((c) => c.id)
            .toArray();


        return instance;
    }

}

