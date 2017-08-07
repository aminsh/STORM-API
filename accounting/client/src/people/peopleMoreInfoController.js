export default class peopleMoreInfoController {
    constructor($scope,
                $uibModalInstance,
                formService,
                peopleApi,
                devConstants,
                translate,
                $state, data) {

        this.$scope = $scope;
        this.peopleApi = peopleApi;
        this.$uibModalInstance = $uibModalInstance;
        this.$state = $state;
        this.devConstants = devConstants;
        this.formService = formService;

        this.people=[];
        this.people.summatry=[];

        this.id = data.id;
            peopleApi.getById(this.id)
                .then(result => this.people = result);
            peopleApi.summary(data.id).then(result=>{

                let items = result.asEnumerable();

                let colors = ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];

                this.series = [translate('Sum Of Buy Amount'), translate('Count Of Buy Quantity')];

                this.datasetOverride = [{yAxisID: 'y-axis-1'}, {yAxisID: 'y-axis-2'}];

                this.options = {
                    responsive: true,
                    legend: {display: true},
                    maintainAspectRatio:false,
                    scales: {
                        yAxes: [
                            {
                                id: 'y-axis-1',
                                type: 'linear',
                                display: true,
                                position: 'left'
                            },
                            {
                                id: 'y-axis-2',
                                type: 'linear',
                                display: true,
                                position: 'right'
                            }
                        ]
                    }
                };

                this.labels = items.select(item => item.monthDisplay).toArray();

                this.labelForDisplay = colors.asEnumerable()
                    .take(this.labels.length)
                    .select(c => ({color: c, label: this.labels[colors.indexOf(c)]}))
                    .toArray();

                this.data = [items.select(item => parseInt(item.sumPrice)).toArray(),items.select(item => parseInt(item.count)).toArray()];
            });
    }

    close() {
        this.$uibModalInstance.dismiss()
    }
}
