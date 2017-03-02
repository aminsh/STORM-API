import Chart from 'chart.js';
import Collection from 'dev.collection';

export default function () {
    return {
        restrict: 'E',
        template: '<canvas width="400" height="400"></canvas>',
        replace: true,
        link: (scope, element, attrs) => {
            let ctx = element,
                colors = [
                    '#07f3a4',
                    '#98f3d4',
                    '#e0f3ec',
                    '#ff6384',
                    '#eaadba',
                    '#f5dae0',
                    '#ffce56',
                    '#f7e4b7',
                    '#f3ead6',
                    '#36a2eb',
                    '#88c0e6',
                    '#b3d8f1'
                ],
                labels = eval(`scope.${attrs.kLabels}`),
                usableColors = new Collection(colors)
                    .asEnumerable()
                    .take(labels.length)
                    .toArray(),
                data = {
                    labels: labels,
                    datasets: [
                        {
                            data: eval(`scope.${attrs.kDataSource}`),
                            backgroundColor: usableColors,
                            hoverBackgroundColor: usableColors
                        }
                    ]
                },
                chart = new Chart(ctx, {
                    type: 'doughnut',
                    data: data,
                    //options: options
                });
        }
    }
}