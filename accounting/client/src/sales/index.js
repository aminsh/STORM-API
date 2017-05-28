"use strict";

import accModule from '../acc.module';

import salesInvoiceController from './salesInvoiceController';
import salesListController from './salesListController';

import './saleInvoiceApi';

accModule
    .controller('salesInvoiceController', salesInvoiceController)
    .controller('salesListController', salesListController);
