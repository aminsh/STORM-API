import accModule from '../acc.module';

function routeNavigatorService($route, $location) {

    function getRoute(name) {
        return Object.keys($route.routes)
            .asEnumerable()
            .select((r) => $route.routes[r])
            .first((r) => r.controller == '{0}Controller'.format(name));
    }

    let navigate = (name, parameters, queryString) => {
        let route = getRoute(name);
        let path = route.originalPath;

        route.keys.forEach((key) => {
            let parameterValue = parameters[key.name] || '';
            if (parameterValue == '' && key.optional == true)
                throw new Error('[{0}] parameter is not optional'.format(key.name));

            path = path.replace(new RegExp(':{0}'.format(key.name)), parameterValue);
        });

        if (queryString)
            $location.search(queryString);

        $location.path(path);

    };

    return navigate;
}

accModule.factory('navigate', routeNavigatorService);
accModule.service('$route', function () {
    this.$get = () => {
    };
});


