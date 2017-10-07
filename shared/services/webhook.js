"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    rp = require('request-promise'),
    knex = instanceOf('knex');

class Webhook {

    constructor() {
        this.createLogg = async(this.createLogg);
        this.send = async(this.send);
    }

    createDelivery(data) {
        await(knex('webhookDeliveries').insert(data));
    }

    send(config, parameters) {
        const options = {
            uri: config.url,
            form: this.mapper(parameters),
            method: config.method,
            headers: config.headers.asEnumerable().toObject(item=> item.key, item => item.value),
        };

        let sentOn = new Date(),
            receivedOn,
            body,
            error;

        try {
            body = await(rp(options));
        }
        catch (e) {
            error = e;
        }
        finally {
            receivedOn = new Date();
        }

        await(this.createDelivery({
            webhookId: config.id,
            sentOn,
            receivedOn,
            responseCode: error ? error.statusCode : 200,
            response: body || error.statusMessage,
        }));
    }

    mapper(config, parameters) {

        const mapper = config.mapper;

        if (!config.mapper)
            return parameters;

        const sources = Object.keys(parameters).asEnumerable()
            .select(key => ({key, value: parameters[key]}))
            .toArray();

        sources.forEach(item => {
            const mapperItem = mapper.asEnumerable()
                .singleOrDefault(m => m.sourceProperty === item.key);

            if(!mapperItem)
                return;

            item.key = mapperItem.targetProperty;
        });

        return sources.asEnumerable()
            .toObject(item => item.key, item => item.value);
    }
}

module.exports = Webhook;