import accModule from "../acc.module";
import "kendo-web";

let translate = JSON.parse(localStorage.getItem('translate')),
    create = translate['Create'],
    tag = translate['Tag'];

function combobox($window) {
    return {
        require: 'ngModel',
        restrict: 'E',
        replace: true,
        template: '<input  style="width: 100%;" />',
        scope: {
            dataSource: '=kDataSource',
            onChanged: '&kOnChanged',
            onDataBound: '&kOnDataBound',
            onCreated: '&kOnCreated'
        },
        link: function (scope, element, attrs, ngModel) {
            let hasNoDataTemplate = attrs.hasOwnProperty('showNoDataTemplate'),
                onCreatedName = attrs.kOnCreated.substring(0, attrs.kOnCreated.indexOf('('))
                    .split('.')
                    .asEnumerable().last();

            $window[onCreatedName] = function (widgetId, value) {
                let dataSource = scope.dataSource;

                scope.onCreated({value})
                    .then(result => {
                        let item = {};
                        item[attrs.kDataTextField] = result[attrs.kDataTextField];
                        item[attrs.kDataValueField] = result[attrs.kDataValueField];
                        dataSource.add(item);
                    });
            };

            let template = `<div>
                <button class="btn btn-primary" 
                onclick="${onCreatedName}('#: instance.element[0].id #', '#: instance.input.val() #')">
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
                virtual: eval(`scope.${attrs.kVirtual}`),
                dataSource: scope.dataSource,
                noDataTemplate: hasNoDataTemplate ? template : null,
                select: function (e) {
                    let dataItem = this.dataItem(e.item.index());
                    ngModel.$setViewValue(dataItem[attrs.kDataValueField]);
                    if (scope.onChanged)
                        scope.onChanged({$item: dataItem});

                    scope.$apply();
                },
                dataBound: function (e) {
                    if (scope.onDataBound)
                        scope.onDataBound(e);
                }
            };

            if (attrs.kCascadeFrom) {
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
