import * as rp from 'request-promise';

export class HttpRequest {
    constructor() {
        this.headers = { 'Content-Type' : 'application/json' };
    }

    method(method: HttpMethod, url: string): HttpRequest {
        this.methodName = method;
        this.url = url;
        return this;
    }

    setHeader(key: string, value: any): HttpRequest {
        this.headers[ key ] = value;
        return this;
    }

    query(queryString): HttpRequest {
        this.queryString = queryString;
        return this;
    }

    body(data: any): HttpRequest {
        this.bodyParams = data;
        return this;
    }

    form(data: any): HttpRequest {
        this.formParams = data;
        return this;
    }

    noJsonResult(): HttpRequest {
        this.json = false;
        return this;
    }

    private headers: { [ key: string ]: string };
    private methodName: HttpMethod;
    private url: string;
    private queryString: { [ key: string ]: any };
    private bodyParams: any;
    private formParams: any;
    private json: boolean = true;

    async execute(): Promise<any> {
        const options = {
            uri : this.url,
            method : this.methodName,
            qs : this.queryString,
            json : this.json,
            body : this.bodyParams,
            form : this.formParams,
            headers : this.headers
        };

        return await rp(options);
    }

}

export enum HttpMethod {
    GET, POST, PUT, DELETE
}
