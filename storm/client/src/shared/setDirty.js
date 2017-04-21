export default function setDirty() {
  return function(form) {
    angular.forEach(form.$error, function (type) {
      angular.forEach(type, function (field) {
        field.$setDirty();
      });
    });
    return form;
  }
}
