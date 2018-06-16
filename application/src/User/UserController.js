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
    register(req, res) {

        let loginByGoogle = req.query.loginByGoogle;

        if (loginByGoogle) {
            let id = this.userService.registerByGoogle(req.body.googleToken, req.body.profile);

            return this.userQuery.getOne({id});
        }

        try {
            let result = this.userService.register(req.body);

            return {user: this.userQuery.getOne({id: result.id}), duration: result.duration};
        }
        catch (e) {
            if (e instanceof ValidationException)
                return res.status(400).send(e.errors[0]);

            res.sendStatus(500);
        }
    }

    @Post("/login")
    @async()
    login(req, res) {

        try {
            let id = this.userService.login(req.body);

            return this.userQuery.getOne({id});
        }
        catch (e) {
            if (e instanceof ValidationException)
                return res.status(400).send(e.errors[0]);

            res.sendStatus(500);
        }
    }

    @Post("/logout", "ShouldAuthenticated")
    @async()
    logout() {

        this.userService.regenerateToken();
    }

    @Post("/mobile-entry", "ShouldAuthenticated")
    @async()
    mobileEntry(req, res) {
        try {
            let result = this.userService.mobileEntry(req.body.mobile);

            return Object.assign(result, {message: 'کد فعالسازی به موبایل شما ارسال خواهد شد'});
        }
        catch (e) {
            if (e instanceof ValidationException)
                return res.status(400).send(e.errors[0]);

            res.sendStatus(500);
        }
    }

    @Post("/verify-mobile/:code")
    @async()
    verifyMobile(req, res) {

        try {
            let id = this.userService.verifyMobile(req.params.code);

            return this.userQuery.getOne({id});
        }
        catch (e) {
            if (e instanceof ValidationException)
                return res.status(400).send(e.errors[0]);

            res.sendStatus(500);
        }
    }

    @Post("/change-password", "ShouldAuthenticated")
    @async()
    changePassword(req) {

        this.userService.changePassword(req.body.password);
    }

    @Post("/reset-password/by-mobile")
    @async()
    resetPasswordByMobile(req, res) {

        try {

            this.userService.resetPasswordByMobile(req.body.mobile);
        }
        catch (e) {
            if (e instanceof ValidationException)
                return res.status(400).send(e.errors[0]);

            res.sendStatus(500);
        }
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