import { BranchRepository } from "./branch.repository";
import { ShouldHaveBranchMiddleware } from "./shouldHaveBranch.middleware";
import { BranchMemberRepository } from "./branchMember.repository";
import { Module } from "../Infrastructure/ModuleFramework";

@Module({
    providers : [ BranchRepository, BranchMemberRepository, ShouldHaveBranchMiddleware ]
})
export class BranchModule {
}