import {inject} from "inversify";
import {Controller, Post, WithoutControlPermissions} from "../Infrastructure/expressUtlis";

@Controller("/v1/site")
@WithoutControlPermissions()
class SiteController {

    @inject("EmailService")
    /**@type {EmailService}*/ emailService = undefined;

    @Post("/suggestions")
    suggestions(req) {

        const cmd = req.body,

            options = {
                to: process.env.EMAIL_AUTH_USER,
                subject: `Suggestion on site ${cmd.userName}`,
                html: `<p>${cmd.userName}</p>
                       <p>${cmd.email}</p>
                       <p>${cmd.phone}</p>
                       <p>${cmd.description}</p>`
            };

        this.emailService.sendAsync(options);

    }
}
