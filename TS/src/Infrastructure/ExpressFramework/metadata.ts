import {Controller as IController, Method, NoLog as INoLog, Parameter} from "./Types";

export let controllers: IController[] = [],
    methods: Method[] = [],
    parameters: Parameter[] = [],
    noLogs: INoLog[] = [],
    noControlPermissions = [];
