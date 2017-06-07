import accModule from '../acc.module';
let translation = JSON.parse(localStorage.getItem('translate'));

function gridFilterCellTypeProvider() {
    var type = {
        string: {
            operator: "contains",
            template: `<input class="form-control" type="text" ng-model="filter.value"/>`
        },
        number: {
            operator: "eq",
            data: [
                {key: 'eq', display: translation['Equal to']},
                {key: 'gte', display: translation['Greater than or equal to']},
                {key: 'gt', display: translation['Greater than']},
                {key: 'lte', display: translation['Less than or equal to']},
                {key: 'lt', display: translation['Less than']}
            ],
            template: `<li>
                <dev-tag-numeric ng-model="filter.value"></dev-tag-numeric>
            </li>
            <li>
                <select 
                        ng-model="filter.operator"
                        ng-options="p.key as p.display for p in items"
                        class="form-control">
                    <option value="">{{'Select ...'|translate}}</option>
                </select>
            </li>`
        },
        date: {
            template: `<li>
                <dev-tag-datepicker ng-model="filter.value"></dev-tag-datepicker>
            </li>`
        },
        boolean: {
            template: `<li>
                <dev-tag-check-box ng-model="filter.value"></dev-tag-check-box>
            </li>`
        }
    };

    function combo(option) {
        return {
            showOperators: false,
            operator: "eq",
            template: function (args) {
                args.element.kendoComboBox({
                    placeholder: '...',
                    dataTextField: option.text,
                    dataValueField: option.value,
                    valuePrimitive: true,
                    filter: "contains",
                    autoBind: false,
                    minLength: 2,
                    dataSource: {
                        type: "json",
                        serverFiltering: true,
                        transport: {
                            read: {
                                url: option.url
                            },
                            parameterMap: function (options) {
                                return kendo.stringify(options);
                            }
                        },
                        schema: {
                            parse: function (response) {
                                return response.data;
                            }
                        }
                    }
                });
            }
        }
    }

    function dropdown(option) {
        return {
            showOperators: false,
            operator: "eq",
            template: function (args) {
                args.element.kendoDropDownList({
                    dataTextField: option.text,
                    dataValueField: option.value,
                    filter: "contains",
                    autoBind: false,
                    minLength: 2,
                    dataSource: option.data,
                    valuePrimitive: true
                });
            }
        };

    }

    this.control = {
        combo: combo,
        dropdown: dropdown
    };

    this.$get = function () {
        return type;
    };

    this.set = function (extendedObject) {
        type = angular.extend(type, extendedObject);
    }
}

accModule.provider('gridFilterCellType', gridFilterCellTypeProvider);

