import accModule from '../acc.module';

function validationSummary() {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/validationSummary.html',
        link(scope, element,attrs){
            let $element = $(element),
                $content = $element.find('.alert'),
                $ul = $element.find('ul');

            $content.hide();

            scope.$watchCollection(attrs.errors, newValue => {
                if(newValue.length == 0){
                    $content.hide();
                    $ul.html('');
                    return;
                }

                $content.show();

                newValue.forEach(e => {
                    $ul.append(`<li>${e}</li>`);
                });
            });
        }
    };
}

accModule.directive('devTagValidationSummary', validationSummary);
