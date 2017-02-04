dynamicMessages.$inject = ['$compile'];

export default function dynamicMessages($compile) {
  return {
    restrict: 'A',
    priority:10000,
    replace: false,
    terminal:true,
    scope: {
      getter: '=getter',
      attr: '@'
    },
    link: function link(scope, element, attrs) {
      console.log(scope);
      element.attr(scope.attr, scope.getter);
      element.removeAttr('dynamic-messages');
      // console.log(element);
      $compile(element)(scope);
    }
  }
}
