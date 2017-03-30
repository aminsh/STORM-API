
export default function navigate($route, $location) {

    function getRoute(name) {
        return getKeys($route.routes)
            .asEnumerable()
            .select((r)=> $route.routes[r])
            .first((r)=> r.controller == '{0}Controller'.format(name));
    }

    let navigate = (name, parameters, queryString)=> {
        let route = getRoute(name);        let path = route.originalPath;

        route.keys.forEach((key)=> {
            let parameterValue = parameters[key.name] || '';
            if (parameterValue == '' && key.optional == true)
                throw new Error('[{0}] parameter is not optional'.format(key.name));

            path = path.replace(`:${key.name}${key.optional ? '?' : ''}`, parameterValue);
        });

        if (queryString)
            $location.search(queryString);

        $location.path(path);

    };

    return navigate;
}


