import UUIDTokenGenerator from "uuid-token-generator";

export default class TokenGenerator {

    generate128Bit(){
        const tokgen = new UUIDTokenGenerator();
        return tokgen.generate();
    }

    generate256Bit(){
        const tokgen = new UUIDTokenGenerator(256, UUIDTokenGenerator.BASE62);
        return tokgen.generate();
    }
}

