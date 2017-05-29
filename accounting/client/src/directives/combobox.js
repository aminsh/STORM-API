import accModule from '../acc.module';
import 'kendo-web';

let translate = JSON.parse(localStorage.getItem('translate')),
    create = translate['Create'],
    tag = translate['Tag'];

function combobox($window) {
    return {
        require: 'ngModel',
        restrict: 'E',
        replace: true,
        template: '<input  style="width: 100%;" />',

        link: function (scope, element, attrs, ngModel) {
            let hasNoDataTemplate = attrs.hasOwnProperty('showNoDataTemplate');

            $window.addValue = function (widgetId, value) {

                var dataSource = eval(`scope.${attrs.kDataSource}`);
                dataSource.add({title: value});
                eval(`scope.${attrs.onCreated}`).call(scope.model,value)
                    .then(result => {
                        combobox.value(combobox.value().concat([result.id]));
                        ngModel.$setViewValue(combobox.value());
                    });
            };

            let template = `<div>
                <button class="btn btn-primary" 
                onclick="addValue('#: instance.element[0].id #', '#: instance.input.val() #')">
                    <i class="fa fa-plus"></i>
                    ${create} "#: instance.input.val() #"
                </button>
                </div>`;

            let options = {
                placeholder: attrs.kPlaceholder,
                dataTextField: attrs.kDataTextField,
                dataValueField: attrs.kDataValueField,
                valuePrimitive: true,
                filter: "contains",
                autoBind: true,
                minLength: 3,
                virtual:eval(`scope.${attrs.kVirtual}`),
                dataSource: eval(`scope.${attrs.kDataSource}`),
                noDataTemplate: hasNoDataTemplate ? template : null,
                select: function (e) {
                    let dataItem = this.dataItem(e.item.index());
                    ngModel.$setViewValue(dataItem[scope.dataValueField]);
                    if (scope[attrs.kOnChanged])
                        scope[attrs.kOnChanged](dataItem);

                    scope.$apply();
                },
                dataBound: function (e) {
                    if (scope[attrs.kOnDataBound])
                        scope[attrs.kOnDataBound](e);
                }
            };

            if (attrs.kCascadeFrom){
                options.cascadeFrom = attrs.kCascadeFrom;
                options.cascadeFromField = attrs.kCascadeFrom;
            }

            let combo = $(element).kendoComboBox(options).data("kendoComboBox");

            scope.$watch(attrs.ngModel, newValue => {
                combo.value(newValue);
            });

            scope.$watch(attrs.ngDisabled, newValue => {
                combo.enable(!newValue);
            });
        }
    };
}

accModule.directive('devTagComboBox', combobox);
