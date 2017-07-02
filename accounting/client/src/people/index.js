"use strict";

import accModule from "../acc.module";
import peopleListController from "./peopleListController";
import peopleCreateController from "./peopleCreateController";
import peopleMoreInfoController from "./peopleMoreInfoController"
import "./peopleApi";

function createPersonService(modalBase) {
    return modalBase({
        controller: peopleCreateController,
        controllerAs: 'model',
        templateUrl: 'partials/people/peopleCreate.html'
    });
}

accModule

    .controller('peopleListController', peopleListController)
    .controller('peopleCreateController', peopleCreateController)
    .controller('peopleMoreInfoController',peopleMoreInfoController)
    .factory('createPersonService', createPersonService);
