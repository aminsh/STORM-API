import {inject} from "inversify";
import {async} from "../Infrastructure/@decorators";
import {Controller, Get, Post, Put, NoLog} from "../Infrastructure/expressUtlis";

@Controller("/v1/users")
export class UserController {

    @inject("UserService")
    /** @type {UserService}*/ userService = undefined;

    @inject("UserQuery")
    /** @type {UserQuery}*/ userQuery = undefined;

    @Get("/")
    @async()
    getAll(req) {
        return this.userQuery.getAll(req.query);
    }

    @Get("/current", "TokenIsValid")
    @async()
    current(req) {

        return this.userQuery.getOne({id: req.user.id});
    }

    @Post("/register")
    @async()
    @NoLog()
    register(req) {

        let loginByGoogle = req.query.loginByGoogle;

        if (loginByGoogle) {
            let id = this.userService.registerByGoogle(req.body.googleToken, req.body.profile);

            return {user: this.userQuery.getOne({id})};
        }

        let result = this.userService.register(req.body);

        return {user: this.userQuery.getOne({id: result.id}), duration: result.duration};
    }

    @Put("/", "TokenIsValid")
    @async()
    @NoLog()
    update(req) {

        this.userService.update(req.body);

        return this.userQuery.getOne({id: req.user.id});
    }

    @Post("/login")
    @async()
    @NoLog()
    login(req) {

        let id = this.userService.login(req.body);

        return this.userQuery.getOne({id});
    }

    @Post("/logout", "ShouldAuthenticated")
    @async()
    @NoLog()
    logout() {

        this.userService.regenerateToken();
    }

    @Post("/mobile-entry", "TokenIsValid")
    @async()
    @NoLog()
    mobileEntry(req) {

        let result = this.userService.mobileEntry(req.body.mobile);

        return Object.assign(result, {message: 'کد فعالسازی به موبایل شما ارسال خواهد شد'});
    }

    @Post("/verify-mobile/:code")
    @async()
    @NoLog()
    verifyMobile(req) {

        let id = this.userService.verifyMobile(req.params.code);

        return this.userQuery.getOne({id});
    }

    @Post("/change-password", "ShouldAuthenticated")
    @async()
    @NoLog()
    changePassword(req) {

        this.userService.changePassword(req.body.password);
    }

    @Post("/reset-password/by-mobile")
    @async()
    @NoLog()
    resetPasswordByMobile(req) {

        this.userService.resetPasswordByMobile(req.body.mobile);
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