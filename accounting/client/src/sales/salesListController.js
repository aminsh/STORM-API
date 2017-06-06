
export default class salesListController {
    constructor(
                translate,
                devConstants,
                logger,
                $timeout,
                navigate,
                $scope) {

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.logger = logger;
        this.translate = translate;

        $scope.gridOption = {
            columns: [
                {name: 'number', title: translate('Number'), width: '120px', type: 'number'},
                {name: 'date', title: translate('Date'), type: 'date', width: '120px',},
                {
                name: 'description', title: translate('Description'), type: 'string', width: '30%',
                },
            ],
            commands: [
                {
                    title: translate('Print'),
                    name: 'print',
                    action: (current) => {
                        let reportParam={"id": current.id}
                        navigate(
                            'report.print',
                            {key: 700},
                            reportParam);
                    }
                }
                ],
            readUrl: devConstants.urls.sales.getAll(),
        };

    }
}
