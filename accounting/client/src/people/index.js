"use strict";

import accModule from "../acc.module";
import peopleListController from "./peopleListController";
import peopleCreateController from "./peopleCreateController";
import peopleMoreInfoController from "./peopleMoreInfoController";
import PeopleApi from "./peopleApi";
import PeopleImportFromExcel from "./people.importFromExcel";

function createPersonService(modalBase) {
    return modalBase({
        controller: peopleCreateController,
        controllerAs: 'model',
        templateUrl: 'partials/people/peopleCreate.html'
    });
}

function peopleImportFromExcelService(modalBase) {
    return modalBase({
        controller: PeopleImportFromExcel,
        controllerAs: 'model',
        templateUrl: 'partials/people/people.importFromExcel.html',
        size: 'lg',
    });
}

accModule

    .controller('peopleListController', peopleListController)
    .controller('peopleCreateController', peopleCreateController)
    .controller('peopleMoreInfoController',peopleMoreInfoController)
    .controller('peopleImportFromExcelController', PeopleImportFromExcel)
    .factory('createPersonService', createPersonService)
    .factory('peopleApi', PeopleApi)
    .factory('peopleImportFromExcelService', peopleImportFromExcelService);
