import accModule from '../acc.module';
import 'kendo-core';
import 'kendo-data';
import 'kendo-list';
import 'kendo-popup';
import 'kendo-combobox';

function combobox() {
    return {
        require: 'ngModel',
        restrict: 'E',
        replace: true,
        template: '<input  style="width: 100%;" />',
        link: function (scope, element, attrs, ngModel) {
            let options = {
                placeholder: attrs.kPlaceholder,
                dataTextField: attrs.kDataTextField,
                dataValueField: attrs.kDataValueField,
                valuePrimitive: true,
                filter: "contains",
                autoBind: false,
                minLength: 3,
                dataSource: eval(`scope.${attrs.kDataSource}`),
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
