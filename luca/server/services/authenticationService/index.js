const config = require('../../config'),
    IntegratedAuthentication = require('./integratedAuthentication'),
    MockedAuthentication = require('./mockedAuthentication');

module.exports = config.mode == 'UNIT'
    ? MockedAuthentication
    : IntegratedAuthentication;