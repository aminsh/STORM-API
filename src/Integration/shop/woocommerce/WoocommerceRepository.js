import {inject, injectable, postConstruct} from "inversify";
import toResult from "asyncawait/await";
import Promise from "promise";
import WooCommerceAPI from "woocommerce-api";

@injectable()
export class WoocommerceRepository {

    @inject("RegisteredThirdPartyRepository")
    /**@type{RegisteredThirdPartyRepository}*/ registeredThirdPartyRepository = undefined;

    /**@type{WooCommerceAPI}*/
    Woocommerce = undefined;

    @postConstruct()
    init() {
        const woocommerceThirdParty = this.registeredThirdPartyRepository.get('woocommerce');

        if (!woocommerceThirdParty)
            return;

        if(!woocommerceThirdParty.data)
            return;

        this.initWoocommerce(woocommerceThirdParty.data);
    }

    initWoocommerce(data) {

        this.Woocommerce = new WooCommerceAPI({
            url: data.url,
            consumerKey: data.consumerKey,
            consumerSecret: data.consumerSecret,
            wpAPI: true,
            version: 'wc/v3'
        });
    }

    get(endpoint) {
        return toResult(
            new Promise((resolve, reject) => {
                this.Woocommerce.get(endpoint, (err, data, res) => {

                    if (err)
                        return reject(err);

                    const result = JSON.parse(res);

                    if(result.data && [400, 404, 401, 500].includes(result.data.status))
                        return reject(result);

                    resolve(result);
                })
            })
        );
    }

    post(endpoint, data) {
        return toResult(
            new Promise((resolve, reject) => {
                this.Woocommerce.post(endpoint, data, (err, data, res) => {

                    if (err)
                        return reject(err);

                    const result = JSON.parse(res);

                    if(result.data && [400, 404, 401, 500].includes(result.data.status))
                        return reject(result);

                    resolve(result);
                })
            })
        );
    }

    put(endpoint, data) {
        return toResult(
            new Promise((resolve, reject) => {
                this.Woocommerce.put(endpoint, data, (err, data, res) => {

                    if (err)
                        return reject(err);

                    const result = JSON.parse(res);

                    if(result.data && [400, 404, 401, 500].includes(result.data.status))
                        return reject(result);

                    resolve(result);
                })
            })
        );
    }

    delete(endpoint) {
        return toResult(
            new Promise((resolve, reject) => {
                this.Woocommerce.delete(endpoint, (err, data, res) => {

                    if (err)
                        return reject(err);

                    const result = JSON.parse(res);

                    if(result.data && [400, 404, 401, 500].includes(result.data.status))
                        return reject(result);

                    resolve(result);
                })
            })
        );
    }
}