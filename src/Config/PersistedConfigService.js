import {inject, injectable} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class PersistedConfigService {
    
    @inject("DbContext") /**@type{DbContext}*/ dbContext = undefined;

    set(key, value) {
        
        const knex = this.dbContext.instance;
        
        let config = toResult(knex.from('config').where('key', key).first());

        if (config)
            return knex('config').where('key', key).update({value});

        return toResult(knex('config').insert({key, value}));
    }

    get(key) {
        const knex = this.dbContext.instance;
        
        return toResult(knex.from('config').where('key', key).first());
    }
}
