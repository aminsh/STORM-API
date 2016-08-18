import accModule from './acc.module';

// load config
import  './config/route.config';
import  './config/menu.config.js';
import  './config/translate.config';
import './config/gridFilterCellTypeConfig';

//load controllers
import './controllers/shellController';
import './controllers/homeController';
import './controllers/generalLedgerAccountsController';
import './controllers/subsidiaryLedgerAccountsController';
import './controllers/subsidiaryLedgerAccountCreateController';
import './controllers/subsidiaryLedgerAccountUpdateController';
import './controllers/detailAccountsController';
import './controllers/detailAccountCreateController';
import './controllers/detailAccountUpdateController';
import './controllers/dimensionsController';
import './controllers/journalsController';
import './controllers/journalUpdateController';
import './controllers/journalLineCreateOrUpdateController';
import './controllers/journalLineUpdateController';


// load apis
import './apis/generalLedgerAccountApi';
import './apis/subsidiaryLedgerAccountApi';
import './apis/detailAccountApi';
import './apis/dimensionCategoryApi';
import './apis/dimensionApi';
import './apis/journalApi';
import './apis/journalLineApi';

// load modals
import './modals/generalLedgerAccountCreate';
import './modals/generalLedgerAccountUpdate';
import './modals/dimensionCreate';
import './modals/dimensionUpdate';
import './modals/journalCreate';

import './localData/constants';

//directives
import './directives/alert';
import './directives/subContent';
import './directives/blockUi';
import './directives/customValidator';
import './directives/validationSummary';

//filter
import './filters/amount';

//service
import './services/formService';
import './services/translateStorageService';

accModule.init();

