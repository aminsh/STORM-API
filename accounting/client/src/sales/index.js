"use strict";

import accModule from '../acc.module';

import salesInvoiceController from './salesInvoiceController';

import './saleInvoiceApi';

accModule
    .controller('salesInvoiceController', salesInvoiceController);
