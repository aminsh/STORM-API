import enums from './enums';
import urls from './urls';
import config from './config';
import accModule from '../acc.module';

let constants = {
    enums: enums,
    urls: urls,
    config: config
};

accModule.constant('constants', constants);

export default constants;