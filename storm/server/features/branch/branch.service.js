"use strict";

const
    /**
     * @type {BranchRepository}*/
    BranchRepository = require('./branch.repository'),
    Crypto = instanceOf('Crypto'),

    /**
     * @type {TokenGenerator}*/
    TokenGenerator = instanceOf('TokenGenerator');

class BranchService {

    constructor() {
        this.branchRepository = new BranchRepository();
    }

    findByToken(token) {
        let userInBranch = this.branchRepository.findByToken(token);

        if (userInBranch)
            return {
                userId: userInBranch.userId,
                branchId: userInBranch.branchId
            };

        try {
            userInBranch = Crypto.verify(token);

            if (userInBranch)
                return {
                    userId: userInBranch.userId,
                    branchId: userInBranch.branchId
                };
        }
        catch (e) {

        }
    }

    userRegenerateToken(memberId) {
        let newToken = TokenGenerator.generate256Bit();

        this.branchRepository.updateMember(memberId,{token: newToken});
    }
}

module.exports = BranchService;