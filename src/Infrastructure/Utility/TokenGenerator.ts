import * as UUIDTokenGenerator from "uuid-token-generator";

export class TokenGenerator {

    static generate128Bit(): string {
        const tokgen = new UUIDTokenGenerator();
        return tokgen.generate();
    }

    static generate256Bit(): string {
        const tokgen = new UUIDTokenGenerator(256, UUIDTokenGenerator.BASE62);
        return tokgen.generate();
    }
}