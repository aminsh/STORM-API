
export default class salesListController {
    constructor(
                translate,
                navigate,
                devConstants,
                logger,
                $timeout,
                $scope,) {

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.logger = logger;
        this.translate = translate;

        this.gridOption = {
            columns: [
                {name: 'number', title: translate('Number'), width: '120px', type: 'number'},
                {name: 'date', title: translate('Date'), type: 'date', width: '120px',},
                {
                name: 'description', title: translate('description'), type: 'string', width: '30%',
                },
            ],
            commands: [
                {
                    title: translate('Print'),
                    name: 'print',
                    icon: 'fa fa-print text-danger',
                    action: (current) => {
                        let reportParam={"id": current.id}
                        navigate(
                            'report.print',
                            {key: 701},
                            reportParam);
                    }
                }
            ],
            readUrl: devConstants.urls.sales.getAll(),
        };

    }
}
