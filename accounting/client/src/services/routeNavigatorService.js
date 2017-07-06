
export default function routeNavigatorService($state, $location) {

    let navigate = (name, parameters, queryString) => {

        if (queryString)
            $location.search(queryString);

        $state.go(name, parameters);
    };

    return navigate;
}




