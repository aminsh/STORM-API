import "bootstrap3-typeahead";

function autocomplete() {
    return {
        transclude: true,
        restrict: 'A',
        require: 'ngModel',
        scope: {
            options: '='
        },
        link(scope, elements, attrs, ngModel) {

            const options = scope.options;

            let params = {minLength: 3};

            if(options.data)
                params.source = options.data;

            if(options.matcher)
                params.source = options.matcher;

            if(options.displayField)
                params.displayText = item => item[options.displayField];


            $(elements).typeahead(params);
        }
    }
}

export default autocomplete;