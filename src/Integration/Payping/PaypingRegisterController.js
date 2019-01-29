import {Controller, Get, Post} from "../../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/payping")
class PaypingRegisterController {
    @inject("State") _state = undefined;

    @inject("RegisteredThirdPartyService")
    /** @type {RegisteredThirdPartyService}*/ registeredThirdPartyService = undefined;

    @Get("/setup", "ShouldHaveBranch")
    setup(req, res) {
        const state = {
            branchId: this._state.branchId,
            userId: this._state.user.id,
            returnUrl: `${process.env['ORIGIN_URL']}/v1/payping/callback`
        };

        let url = `${process.env['CREDENTIALS_URL']}/payping?state=${JSON.stringify(state)}`;
        res.redirect(url);
    }

    @Get("/callback")
    callback(req, res) {
        const state = JSON.parse(req.query.state);
        req.branchId = state.branchId;
        req.user = {id: state.userId};

        this.registeredThirdPartyService.create('payping', {token: state.token}, true);

        res.redirect(`${process.env['DASHBOARD_URL']}/third-party`);
    }
}