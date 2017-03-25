import $ from 'jquery';

export default function (devConstants) {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        scope: {
            kDataSource: '='
        },
        link: (scope, element, attrs) => {
            $(element).kendoPanelBar({
                dataSource: new kendo.data.HierarchicalDataSource({
                    data: devConstants.reports
                })
            });
        }
    }
}