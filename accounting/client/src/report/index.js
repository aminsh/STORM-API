"use strict";

import appModule from '../acc.module';

import ReportListController from './reportList';
import { ReportParametersController, reportParametersModal } from './reportParameters';
import ReportPrintController from './reportPrint';
import ReportDesignController from'./reportDesign';
import ReportLoaderService from './reportLoaderService';
import SalesAggregationController from "./reportPages/salesAggregation.controller";

appModule
    .config($stateProvider => {
        $stateProvider
            .state('report.seasonal', {
                url: '/seasonal',
                controller: 'salesAggregationController',
                controllerAs: 'model',
                templateUrl: 'partials/report/reportPages/salesAggregation.html'
            });
    })
    .controller('reportListController', ReportListController)
    .controller('reportParameterController', ReportParametersController)
    .controller('ReportPrintController', ReportPrintController)
    .controller('reportDesignController', ReportDesignController)
    .controller('salesAggregationController', SalesAggregationController)
    .service('reportLoaderService', ReportLoaderService)
    .factory('reportParameters', reportParametersModal);

