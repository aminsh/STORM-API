"use strict";

const Memory = require('../services/shared').service.Memory;

module.exports = (branchId) => Memory.get(`context.${branchId}`);

