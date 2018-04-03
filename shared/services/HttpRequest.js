"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    rp = require('request-promise');

class HttpRequest {

    constructor() {

        this.headers = {'Content-Type': 'application/json'};
    }

    /**
        * @param {string} url
        * @return {HttpRequest}
     * */
    setUrl(url) {
        this.url = url;
        return this;
    }

    /**
     * @param {string} methodName GET|POST|PUT|DELETE
     * @return {HttpRequest}
     * */
    method(methodName) {
        this.methodName = methodName;
        return this;
    }

    /**
     * @param {string} key
     * @param {string} value
     * @return {HttpRequest}
     * */
    setHeader(key, value) {
        this.headers[key] = value;
        return this;
    }

    /**
     * @param {Object} queryString
     * @return {HttpRequest}
     * */
    query(queryString) {
        this.queryString = queryString;
        return this;
    }

    /**
     * @param {Object} data
     * @return {HttpRequest}
     * */
    body(data) {
        this.bodyParams = data;
        return this;
    }

    /**
     * @param {string} url
     * @return {HttpRequest}
     * */
    get(url) {
        this.setUrl(url);
        this.method('GET');
        return this;
    }

    /**
     * @param {string} url
     * @return {HttpRequest}
     * */
    post(url) {
        this.setUrl(url);
        this.method('POST');
        return this;
    }

    /**
     * @param {string} url
     * @return {HttpRequest}
     * */
    put(url) {
        this.setUrl(url);
        this.method('PUT');
        return this;
    }

    /**
     * @param {string} url
     * @return {HttpRequest}
     * */
    delete(url) {
        this.setUrl(url);
        this.method('DELETE');
        return this;
    }

    execute() {
        let options = {
            uri: this.url,
            method: this.methodName,
            qs: this.queryString,
            body: this.bodyParams,
            json: true,
            headers: this.headers
        };

        return await(rp(options));
    }
}

module.exports = HttpRequest;