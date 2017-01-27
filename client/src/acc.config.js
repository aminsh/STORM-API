import accModule from './acc.module';

// load config
import  './config/route.config';
import  './config/menu.config.js';
import  './config/translate.config';
import './config/gridFilterCellTypeConfig';
import './config/authConfig';


//load controllers
import './controllers/homeController';
import './controllers/generalLedgerAccountsController';
import './controllers/subsidiaryLedgerAccountsController';
import './controllers/subsidiaryLedgerAccountCreateController';
import './controllers/subsidiaryLedgerAccountUpdateController';
import './controllers/detailAccountsController';
import './controllers/dimensionsController';
import './controllers/journalsController';
import './controllers/journalUpdateController';
import './controllers/chequeCategoriesController';
import './controllers/banksController';
import './controllers/journalManagementController';
import './controllers/journalCopy';
import './controllers/journalTemplatesController';
import './controllers/accountReviewController';
import './controllers/accountReviewTurnoverController';
import './controllers/journalPrintController';
import createFiscalPeriodController from  './controllers/createFiscalPeriodController';

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

// load modals
import './modals/generalLedgerAccountCreate';
import './modals/generalLedgerAccountUpdate';
import './modals/dimensionCreate';
import './modals/dimensionUpdate';
import './modals/journalCreate';
import './modals/journalLineCreateOrUpdate';
import './modals/journalBookkeeping';
import './modals/journalAttachImage';
import './modals/chequeCategroyCreate';
import './modals/chequeCategroyUpdate';
import './modals/writeChequeOnJournalLineEntry';
import './modals/showJournalDetail';
import './modals/journalAdvnacedSearch';
import './modals/detailAccountCreate';
import './modals/detailAccountUpdate';

import './localData/constants';

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
import './directives/dropdownlist';
import './directives/grid';
import './directives/layout';
import './directives/numeric';
import './directives/textEditor';
import './directives/checkbox';
import './directives/ngKendoGrid';
import './directives/journalSearchParameters';
import './directives/reportViewer';
import shell from './directives/shell';
import {contentCover, contentCoverForm} from './directives/contentCover';

//filter
import './filters/amount';

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

accModule
    .directive(shell.name, shell)
    .directive('devTagContentCover', contentCover)
    .directive('devTagContentCoverFrom', contentCoverForm)
    .service(currentService.name, currentService)
    .service('fiscalPeriodApi', FiscalPeriodApi)
    .controller(createFiscalPeriodController.name, createFiscalPeriodController);

accModule.init();

