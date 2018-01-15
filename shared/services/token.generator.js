"use strict";

const UUIDTokenGenerator = require('uuid-token-generator');

class TokenGenerator {

    generate128Bit(){
        const tokgen = new UUIDTokenGenerator();
        return tokgen.generate();
    }

    generate256Bit(){
        const tokgen = new UUIDTokenGenerator(256, UUIDTokenGenerator.BASE62);
        return tokgen.generate();
    }
}

module.exports = TokenGenerator;
