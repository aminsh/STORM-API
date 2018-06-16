import "reflect-metadata";
import {container} from "./di.config"

import "./StormOrder";
import "./Branch";
import "./User";
import "./Logger";

import {Context} from "./Context";
import {app} from "../../api/api.config";
import {register} from "./core/expressUtlis";

container.bind("Context").to(Context);

app.use(function (req, res, next) {

    req.requestId = Utility.TokenGenerator.generate128Bit();

    req.container.bind('HttpContext').toConstantValue({request: req});

    next();
});

register(app, container);





