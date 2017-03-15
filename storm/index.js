"use strict";

require('./server/config/routes');
require('./server/config/translation');
require('./server/config/auth').configure();

const memoryService = require('./server/services/memoryService');

memoryService.set('demoUsers', []);


















