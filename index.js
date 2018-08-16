"use strict";

require('babel-polyfill');

/* 1- loading prototypes */
require('./shared/utilities/string.prototypes');
require('./shared/utilities/array.prototypes');
require('./shared/utilities/function.prototypes');


/* 2- loading ioc */
require('./config/ioc');

require('./shared/globals');

require('./application/dist/bootstrap');


