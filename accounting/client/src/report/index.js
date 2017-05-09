"use strict";

import appModule from '../acc.module';

import ReportListController from './reportList';
import { ReportParametersController, reportParametersModal } from './reportParameters';
import ReportPrintController from './reportPrint';
import ReportDesignController from'./reportDesign';

appModule
    .controller('reportListController', ReportListController)
    .controller('reportParameterController', ReportParametersController)
    .controller('ReportPrintController', ReportPrintController)
    .controller('reportDesignController', ReportDesignController)
    .factory('reportParameters', reportParametersModal);