import accModule from '../acc.module';
import $ from 'jquery';

function gridFilterCellTypeProvider() {
    var type = {
        string: {
            showOperators: false,
            operator: "contains",
            modelType: "string"
        },
        number: {
            showOperators: true,
            operator: "eq",
            modelType: "number"
        },
        date: {
            showOperators: false,
            operator: "contains",
            modelType: "string"
        },
        boolean: {}
    }

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
    }

    this.$get = function () {
        return type;
    }

    this.set = function (extendedObject) {
        type = angular.extend(type, extendedObject);
    }
}

accModule.provider('gridFilterCellType', gridFilterCellTypeProvider);

