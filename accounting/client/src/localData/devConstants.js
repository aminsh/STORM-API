import enums from '../../../../shared/enums';
import urls from './urls';
import config from './config';
import accModule from '../acc.module';

let reports = JSON.parse(localStorage.getItem('reports'));



let devConstants = {
    enums: enums,
    urls: urls,
    config: config,
    reports: reports
};

accModule.constant('devConstants', devConstants);

export default devConstants;