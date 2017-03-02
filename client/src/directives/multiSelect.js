import accModule from '../acc.module';
import Collection from 'dev.collection';
import 'kendo-core';
import 'kendo-data';
import 'kendo-list';
import 'kendo-popup';
import 'kendo-multiselect';

let translate = JSON.parse(localStorage.getItem('translate')),
    create = translate['Create'],
    tag = translate['Tag'];

function multiSelect($window) {
    return {
        require: 'ngModel',
        restrict: 'E',
        replace: true,
        template: '<select style="width: 100%"></select>',
        link: function (scope, element, attrs, ngModel) {

            let hasNoDataTemplate = attrs.hasOwnProperty('showNoDataTemplate');

            $window.addValue = function (widgetId, value) {
                var dataSource = scope[attrs.kDataSource];
                dataSource.add({title: value});
                scope[attrs.onCreated](value)
                    .then(result =>
                        multiSelect.value(multiSelect.value().concat([result.id])));
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
                    autoBind: false,
                    minLength: 3,
                    dataSource: scope[attrs.kDataSource],
                    noDataTemplate: hasNoDataTemplate ? template : null,
                    select: function (e) {
                        let dataItem = e.dataItem,
                            model = ngModel.$viewValue || [];

                        model.push(dataItem[attrs.kDataValueField]);
                        ngModel.$setViewValue(model);

                        if (scope[attrs.kOnChanged])
                            scope[attrs.kOnChanged](dataItem);

                        scope.$apply();
                    },
                    deselect: function (e) {
                        let dataItem = e.dataItem,
                            model = ngModel.$viewValue || [];

                        Collection.remove(model, dataItem[attrs.kDataValueField]);
                        ngModel.$setViewValue(model);

                        if (scope[attrs.kOnChanged])
                            scope[attrs.kOnChanged](dataItem);

                        scope.$apply();
                    }
                },
                multiSelect = $(element).kendoMultiSelect(options).data("kendoMultiSelect");

            scope.$watch(attrs.ngModel, newValue => {
                multiSelect.value(newValue);
            });
        }
    };
}

accModule.directive('devTagMultiSelect', multiSelect);

