
export default function formService() {

    function setDirty(form) {
        angular.forEach(form.$error, function (type) {
            angular.forEach(type, function (field) {
                field.$setDirty();
            });
        });
        return form;
    }

    function setClean(form) {
        angular.forEach(form.$error, function (type) {
            angular.forEach(type, function (field) {
                field.$setPristine();
            });
        });
    }

    function setDirtySubForm(form) {
        Object.keys(form).asEnumerable()
            .where(key => key.includes('form-'))
            .toArray()
            .forEach(key => setDirty(form[key]));
    }

    return {
        setDirty: setDirty,
        setDirtySubForm: setDirtySubForm,
        setClean: setClean
    }
}
