const Promise = require('promise');

function waitFor(miliSeconds) {
    return new Promise(resolve => setTimeout(()=> resolve(), miliSeconds));
}

module.exports = {waitFor};