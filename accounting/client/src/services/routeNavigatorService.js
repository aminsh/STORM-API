import accModule from '../acc.module';

function routeNavigatorService($state, $location) {

    let navigate = (name, parameters, queryString) => {

        if (queryString)
            $location.search(queryString);

        $state.go(name, parameters);
    };

    return navigate;
}

accModule.factory('navigate', routeNavigatorService);



