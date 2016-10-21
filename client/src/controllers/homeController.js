import accModule from '../acc.module';

function homeController($scope, $timeout, $route, $rootScope, constants, logger, $cookies,
                        journalAdvancedSearchModalService) {
    $scope.current = {
        fiscalPeriod: parseInt($cookies.get('current-period')),
        mode: $cookies.get('current-mode')
    };

    $scope.fiscalPeriodDataBound = (e)=> {
        let item = e.sender.dataItem();
        $rootScope.$emit('currentPeriodChanged', item.display);
    };

    $scope.periodDataSource = {
        type: "json",
        serverFiltering: true,
        transport: {
            read: {
                url: constants.urls.period.all()
            }
        },
        schema: {
            data: 'data'
        }
    };

    $scope.periodOnChange = (e)=> {
        let item = e.sender.dataItem();
        $cookies.put('current-period', item.id);
        $rootScope.$emit('currentPeriodChanged', item.display);
    };

    $scope.modesDataSource = constants.enums.AccMode().data;
    $rootScope.$emit('currentModeChanged',
        constants.enums.AccMode().getDisplay($scope.current.mode));

    $scope.modeOnChanged = ()=> {
        $cookies.put('current-mode', $scope.current.mode);

        let modeDisplay = constants.enums.AccMode().getDisplay($scope.current.mode);
        $rootScope.$emit('currentModeChanged', modeDisplay);
    };

    $scope.search = ()=> {
        journalAdvancedSearchModalService.show();
    };

    $scope.gridOptions = {
        dataSource: [
            {FirstName: 'amin', LastName: 'sheikhi', City: 'Tehran',}
        ],
        sortable: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [{
            field: "FirstName",
            title: "First Name",
            width: "120px",
            template: '<h1' +
            'popover="Included journal description and article" ' +
            'popover-trigger="mouseenter" ' +
            'popover-placement="left"' +
            '>{{dataItem.LastName}}</h1>'
        }, {
            field: "LastName",
            title: "Last Name",
            width: "120px"
        }, {
            field: "City",
            width: "120px"
        }]
    };
}

accModule
    .controller('homeController', homeController);