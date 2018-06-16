import {inject} from "inversify";
import {async} from "../core/@decorators";
import {Controller, Get, Post} from "../core/expressUtlis";

@Controller("/v1/users")
export class UserController {

    @inject("UserService")
    /** @type {UserService}*/ userService = undefined;

    @inject("UserQuery")
    /** @type {UserQuery}*/ userQuery = undefined;

    @Post("/register")
    @async()
    register(req) {

        let loginByGoogle = req.query.loginByGoogle;

        if (loginByGoogle) {
            let id = this.userService.registerByGoogle(req.body.googleToken, req.body.profile);

            return {user: this.userQuery.getOne({id})};
        }

        let result = this.userService.register(req.body);

        return {user: this.userQuery.getOne({id: result.id}), duration: result.duration};
    }

    @Post("/login")
    @async()
    login(req) {

        let id = this.userService.login(req.body);

        return this.userQuery.getOne({id});
    }

    @Post("/logout", "ShouldAuthenticated")
    @async()
    logout() {

        this.userService.regenerateToken();
    }

    @Post("/mobile-entry", "ShouldAuthenticated")
    @async()
    mobileEntry(req) {

        let result = this.userService.mobileEntry(req.body.mobile);

        return Object.assign(result, {message: 'کد فعالسازی به موبایل شما ارسال خواهد شد'});
    }

    @Post("/verify-mobile/:code")
    @async()
    verifyMobile(req) {

        let id = this.userService.verifyMobile(req.params.code);

        return this.userQuery.getOne({id});
    }

    @Post("/change-password", "ShouldAuthenticated")
    @async()
    changePassword(req) {

        this.userService.changePassword(req.body.password);
    }

    @Post("/reset-password/by-mobile")
    @async()
    resetPasswordByMobile(req) {

        this.userService.resetPasswordByMobile(req.body.mobile);
    }

    @Get("/current", "ShouldAuthenticated")
    @async()
    current(req) {
        return this.userQuery.getOne({id: req.user.id});
    }

    @Get("/is-unique-email/:email")
    @async()
    isUniqueEmail(req) {
        return !this.userQuery.getByEmail(req.params.email);
    }

    @Get("/is-unique-mobile/:mobile")
    @async()
    isUniqueMobile(req) {
        return !this.userQuery.getOne({mobile: req.params.mobile, state: 'active'})
    }
}