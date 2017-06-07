"use strict";

import appModule from '../acc.module';

import ReportListController from './reportList';
import { ReportParametersController, reportParametersModal } from './reportParameters';
import ReportPrintController from './reportPrint';
import ReportDesignController from'./reportDesign';
import ReportLoaderService from './reportLoaderService';

appModule
    .controller('reportListController', ReportListController)
    .controller('reportParameterController', ReportParametersController)
    .controller('ReportPrintController', ReportPrintController)
    .controller('reportDesignController', ReportDesignController)
    .service('reportLoaderService', ReportLoaderService)
    .factory('reportParameters', reportParametersModal);