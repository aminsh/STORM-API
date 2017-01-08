"use strict";

let ModelBase = require('../utilities/modelBase');

class User {
  get id(){
    return {type: 'STRING', primaryKey: true}
  }

  get name(){
    return 'STRING';
  }
}

module.exports = User;
