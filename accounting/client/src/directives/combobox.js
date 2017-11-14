"use strict";

import accModule from "../acc.module";
import angular from "angular";

function combo($parse, apiPromise, promise) {
    return {
        restrict: 'E',
        require: ['ngModel'],
        scope: {
            onChanged: '&kOnChanged',
            onRemoved: '&kOnRemoved',
            onCreated: '&kOnCreated',
            onBound: '&kOnBound'
        },
        template: `
        <ui-select  class="ui-select"
        ng-model="selectionModel"
        on-select="onItemSelect($item, $model)"
        on-remove="onItemRemove($item, $model)"
        ng-disabled="disabled"><ui-select-match></ui-select-match>
            <ui-select-choices refrech="onSearch($select)" repeat="item in items | filter:$select.search"></ui-select-choices>
        <ui-select-no-choice>
        <dev-tag-button
                                ng-click="onCreate($select.search)"
                                icon="glyphicon glyphicon-plus"
                                style-type="primary"
                                title="{{'Create' | translate}} {{$select.search}}"></dev-tag-button>
        </ui-select-no-choice>
    </ui-select>`,
        compile(tElement, tAttrs) {
            let displayPropSufix = tAttrs.kDataTextField ? '.' + tAttrs.kDataTextField : '',
                isMultiple = angular.isDefined(tAttrs.multiple);

            if (tAttrs.ngModel) {
                tAttrs.$set('ngModel', '$parent.' + tAttrs.ngModel, false);
            }

            /*if (tAttrs.onChanged)
             $('ui-select', tElement).attr('on-select', tAttrs.onChanged);*/

            if (tAttrs.searchEnabled)
                $('ui-select', tElement).attr('search-enabled', tAttrs.searchEnabled);

            if (angular.isDefined(tAttrs.multiple))
                $('ui-select', tElement).attr('multiple', '');

            if (tAttrs.focusOn)
                $('ui-select', tElement).attr('focus-on', tAttrs.focusOn);

            if (tAttrs.kPlaceholder) {
                $('ui-select-match, *[ui-select-match]', tElement).attr('placeholder', tAttrs.kPlaceholder);
            }

            if (isMultiple) {
                $('ui-select-match, *[ui-select-match]', tElement).html('{{$item' + displayPropSufix + '}}');
            } else {
                $('ui-select-match, *[ui-select-match]', tElement).html('{{$select.selected' + displayPropSufix + '}}');
            }

            let uiSelectChoices = $('ui-select-choices, *[ui-select-choices]', tElement);
            uiSelectChoices.attr('repeat', 'item in items | filter:$select.search');

            uiSelectChoices.attr('refresh', 'onSearch($select)');
            uiSelectChoices.attr('refresh-delay', '300');

            uiSelectChoices.html('<div ng-bind-html="item' + displayPropSufix + ' | highlight: $select.search"></div>');

            if (angular.isDefined(tAttrs.groupBy)) {
                uiSelectChoices.attr('group-by', `'${tAttrs.groupBy}'`);
            }

            return function link(scope, element, attrs, ctrls) {
                scope.ngModel = ctrls[0];
                scope.disabled = false;
                scope.items = [];

                const mapper = attrs.mapper,
                    resolve = attrs.resolve ? eval('scope.$parent.' + attrs.resolve) : undefined;

                scope.isMultiple = angular.isDefined(attrs.multiple);
                scope.itemsGetter = $parse(attrs.kDataSource);
                if (angular.isDefined(attrs.kDataValueField) && attrs.kDataValueField !== '') {
                    scope.valuePropGetter = $parse(attrs.kDataValueField);
                }

                scope.$watch(attrs.ngDisabled, newValue => {
                    scope.disabled = newValue;
                });

                scope.getValueMapper = function (itemObject) {
                    return scope.valuePropGetter ? scope.valuePropGetter(itemObject) : itemObject;
                };

                scope.updateValueFromModel = function (modelValue) {
                    if (scope.isMultiple) {
                        let parameters = getMultipleParameters(attrs.kDataValueField, modelValue);
                        modelValue && modelValue.length && getData(parameters)
                            .then(result => {
                                scope.selectionModel = result.data;
                            });
                        /*var selectionArray = [];
                         angular.forEach(modelValue, function (modelItem, key) {
                         var modelItemValue = scope.getValueMapper(modelItem);
                         selectionArray.push(modelItemValue);
                         });
                         scope.selectionModel = selectionArray;*/
                    } else {

                        if (!modelValue) {
                            scope.selectionModel = modelValue;
                            return;
                        }

                        getData(getParameters(attrs.kDataValueField, modelValue))
                            .then(result => {
                                let item = result.data[0];

                                if (item) {
                                    scope.selectionModel = item;

                                    if (scope.onBound)
                                        scope.onBound({$item: item});
                                }
                            });
                    }
                };

                scope.onSearch = $select => {
                    let parameters = getParameters(attrs.kDataTextField, $select.search);

                    getData(parameters)
                        .then(result => scope.items = result.data.length ? result.data : ['noData']);
                };

                if (scope.isMultiple) {
                    scope.$watchCollection(attrs.ngModel, function (modelValue, oldValue) {
                        scope.updateValueFromModel(modelValue);
                    });
                } else {
                    scope.$watch(attrs.ngModel, function (modelValue) {
                        scope.updateValueFromModel(modelValue);
                    });
                }

                //watch the items in case of async loading
                //scope.$watch(attrs.items, function(){
                //	scope.updateValueFromModel(scope.ngModel.$modelValue);
                //});

                scope.onItemSelect = function (item, model) {
                    var modelValue = scope.getValueMapper(item);
                    if (scope.isMultiple) {
                        scope.ngModel.$viewValue && scope.ngModel.$viewValue.push(modelValue);
                    } else {
                        scope.ngModel.$setViewValue(modelValue);
                    }

                    if (scope.onChanged)
                        scope.onChanged({$item: item});
                };

                scope.onItemRemove = function (item, model) {
                    var removedModelValue = scope.getValueMapper(item);
                    if (scope.isMultiple) {
                        var removeIndex = null;
                        angular.forEach(scope.ngModel.$viewValue, function (itemValue, index) {
                            if (itemValue == removedModelValue) {
                                removeIndex = index;
                                return false;
                            }
                        });
                        if (removeIndex) {
                            scope.ngModel.$viewValue.splice(removeIndex, 1);
                        }

                        scope.onRemoved && scope.onRemoved({$item: item});
                    } else {
                        scope.ngModel.$setViewValue(removedModelValue);
                    }
                };

                scope.onSearch = $select => {
                    let parameters = getParameters(attrs.kDataTextField, $select.search);
                    getData(parameters)
                        .then(result => {
                            scope.items = result.data.length ? result.data : ['noData'];
                        });
                };

                scope.onCreate = search => {
                    if (scope.onCreated)
                        scope.onCreated({$search: search});
                };

                function getParameters(dataTextField, search) {
                    let parameters = {
                        skip: 0,
                        take: 20,
                        filter: {logic: 'and'}
                    };

                    if (search)
                        parameters.filter.filters = [{field: dataTextField, operator: 'contains', value: search}];

                    return parameters;
                }

                function getMultipleParameters(field, values) {
                    let parameters = {
                        skip: 0,
                        take: 20,
                        filter: {logic: 'or'}
                    };

                    if (values && values.length)
                        parameters.filter.filters = values.asEnumerable()
                            .select(v => ({field: field, operator: 'eq', value: v}))
                            .toArray();

                    return parameters;

                }

                function getData(parameters) {

                    if (resolve)
                        return promise.create(res => {
                            apiPromise.get(attrs.url, parameters)
                                .then(result => {
                                    res(resolve(result));
                                });
                        });

                    if (mapper)
                        return promise.create(resolve => {
                            apiPromise.get(attrs.url, parameters)
                                .then(result => {
                                    result.data = result.data.asEnumerable().select(mapper).toArray();
                                    resolve(result);
                                });
                        });

                    return apiPromise.get(attrs.url, parameters);
                }
            }
        }
    }
}

accModule.directive('devTagComboBox', combo)
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('/global/dg-ui/dg-select.tpl.html',
            `<ui-select class="ui-select" 
ng-model="selectionModel" 
on-select="onItemSelect($item, $model)" 
on-remove="onItemRemove($item, $model)" 
ng-disabled="disabled"><ui-select-match></ui-select-match>
<ui-select-choices refrech="onSearch($select)" ></div></ui-select-choices>
<ui-select-no-choice><a class="btn btn-primary">{{'Create' | translate}} {{$select.search}}</a></ui-select-no-choice>
</ui-select>`);
        $templateCache.put('/global/dg-ui/dg-select-multi.tpl.html', '<ui-select class="ui-select" multiple ng-model="selectionModel" on-select="onItemSelect($item, $model)" on-remove="onItemRemove($item, $model)" ng-disabled="disabled"><ui-select-match></ui-select-match><ui-select-choices></ui-select-choices></ui-select>');
    }]);
