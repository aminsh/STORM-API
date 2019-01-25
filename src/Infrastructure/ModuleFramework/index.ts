import {registerController, registerProvider} from "../DependencyInjection";

interface ModuleParameters {
    providers?: any[],
    controllers?: any[],
}

export function Module(parameters: ModuleParameters): Function {

    return function () {
        if(parameters.providers)
            parameters.providers.forEach(registerProvider);

        if(parameters.controllers)
            parameters.controllers.forEach(registerController);
    }
}