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

        if (userInBranch) {
            let branch = this.branchRepository.getById(userInBranch.branchId);

            return {
                userId: userInBranch.userId,
                branchId: userInBranch.branchId,
                isActive: branch.status === 'active'
            };
        }

        try {
            userInBranch = Crypto.verify(token);

            if (userInBranch) {
                let branch = this.branchRepository.getById(userInBranch.branchId);
                return {
                    userId: userInBranch.userId,
                    branchId: userInBranch.branchId,
                    isActive: branch.status === 'active'
                };
            }
        }
        catch (e) {

        }
    }

    userRegenerateToken(memberId) {
        let newToken = TokenGenerator.generate256Bit();

        this.branchRepository.updateMember(memberId, {token: newToken});
    }
}

module.exports = BranchService;