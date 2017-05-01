import 'array-prototypes';
import 'function-prototypes';
import 'number-prototypes';
import 'string-prototypes';
import 'jquery-global-resolve';
//import 'slimscroll'; this is not implemented
import 'pace';

import accModule from './acc.module';

// load config
import uiRouteConfig from './config/config.ui.route';
import  './config/menu.config.js';
import  './config/translate.config';
import './config/gridFilterCellTypeConfig';
import './config/authConfig';
import ADMdtpConfig from './config/ADMdtp.config';
import routeSaveLocationSearch from './config/route.save.locationSearch';


//load controllers
import './controllers/homeController';
import './controllers/generalLedgerAccountsController';
import './controllers/subsidiaryLedgerAccountsController';
import './controllers/detailAccountsController';
import './controllers/dimensionsController';
import './controllers/journalsController';
import './controllers/chequeCategoriesController';
import './controllers/banksController';
import './controllers/journalManagementController';
import './controllers/journalCopy';
import './controllers/journalTemplatesController';
import './controllers/accountReviewController';
import './controllers/accountReviewTurnoverController';
import './controllers/journalPrintController';
import createFiscalPeriodController from  './controllers/createFiscalPeriodController';
import chequePrintController from './controllers/chequePrintController';
import reportController from './controllers/reportController';
import reportDesignerController from './controllers/reportDesignerController';

// load apis
import './apis/generalLedgerAccountApi';
import './apis/subsidiaryLedgerAccountApi';
import './apis/detailAccountApi';
import './apis/dimensionCategoryApi';
import './apis/dimensionApi';
import './apis/journalApi';
import './apis/journalLineApi';
import './apis/chequeCategoryApi';
import './apis/bankApi';
import './apis/chequeApi';
import './apis/journalTemplateApi';
import FiscalPeriodApi from './apis/fiscalPeriodApi';
import ReportApi from './apis/reportApi';
import TagApi from './apis/tagApi';

// load modals
import './modals/generalLedgerAccountCreate';
import './modals/generalLedgerAccountUpdate';
import './modals/subsidiaryLedgerAccountEntry';
import './modals/dimensionCreate';
import './modals/dimensionUpdate';
import './modals/journalCreate';
import './modals/journalLineCreateOrUpdate';
import './modals/journalBookkeeping';
import './modals/journalAttachImage';
import './modals/chequeCategroyCreate';
import './modals/chequeCategroyUpdate';
import './modals/showJournalDetail';
import './modals/journalAdvnacedSearch';
import './modals/detailAccountCreate';
import './modals/detailAccountUpdate';

import './localData/devConstants';

//directives
import './directives/alert';
import './directives/subContent';
import './directives/blockUi';
import './directives/customValidator';
import './directives/validationSummary';
import './directives/focusMe';
import './directives/uploader';
import './directives/button';
import './directives/combobox';
import './directives/content';
import './directives/datepicker';
/*import './directives/dropdownlist';
import './directives/multiSelect';*/
import './directives/toolbar';
import './directives/layout';
import './directives/numeric';
import './directives/textEditor';
import './directives/checkbox';
import './directives/radio';
import './directives/journalSearchParameters';
import './directives/reportViewer';
import shell from './directives/shell';
import {contentCover, contentCoverForm} from './directives/contentCover';
import './directives/reportDesigner';
import panelBar from './directives/panelbar';
import shellHeader from './directives/shell.header';
import shellSidebar from './directives/shell.sidebar';
import shellSidebarItem from './directives/shell.sidebar.item';
import grid from './directives/grid';
import gridFilter from './directives/grid.filter';
import gridSort from './directives/grid.sort';
import dataTable from './directives/dataTable';
import paging from './directives/paging';
import ngHtmlCompile from './directives/ngHtmlCompile';
import doughnutChart from './directives/chart.doughnut';

//filter
import './filters/amount';
import totalSum from './filters/total';

//service
import './services/formService';
import './services/translateStorageService';
import './services/apiPromise';
import './services/confirm';
import './services/gridFilterCellTypeProvider';
import './services/logger';
import './services/menuItemsProvider';
import './services/modalBase';
import './services/routeNavigatorService';
import './services/translate';
import './services/prompt';
import './services/showReport';
import  currentService from './services/currentService';
import $ModalFactory from './services/$modalFactory';
import Promise from './services/promise';

import './journal';
import './report';

accModule
    .config(uiRouteConfig)
    .config(ADMdtpConfig)

    .run(routeSaveLocationSearch)

    .directive('shell', shell)
    .directive('shellHeader', shellHeader)
    .directive('shellSidebar', shellSidebar)
    .directive('shellSidebarItem', shellSidebarItem)
    .directive('devTagContentCover', contentCover)
    .directive('devTagContentCoverFrom', contentCoverForm)
    .directive('devTagPanelBar', panelBar)
    .directive('devTagGrid', grid)
    .directive('devTagGridFilter', gridFilter)
    .directive('devTagGridSort', gridSort)
    .directive('devTagPaging', paging)
    .directive('ngHtmlCompile', ngHtmlCompile)
    .directive('devTagChartDoughnut', doughnutChart)
    .directive('devDataTable', dataTable)

    .service('$modelFactory', $ModalFactory)
    .service('promise', Promise)
    .service(currentService.name, currentService)
    .service('fiscalPeriodApi', FiscalPeriodApi)
    .service('reportApi', ReportApi)
    .service('tagApi', TagApi)

    .controller(createFiscalPeriodController.name, createFiscalPeriodController)
    .controller('chequePrintController', chequePrintController)
    .controller('reportController', reportController)
    .controller('reportDesignerController', reportDesignerController)
    .filter('totalSum', totalSum);

accModule.init();

