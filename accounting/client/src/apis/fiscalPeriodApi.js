export  default class FiscalPeriodApi{
    constructor(apiPromise){
        this.urlPrefix = '/acc/api';
        this.apiPromise = apiPromise;

        //this.getAll= '{0}/periods'.format(this.urlPrefix)
    }

    create(fiscalPeriod){
        return this.apiPromise.post(`${this.urlPrefix}/fiscal-periods`, fiscalPeriod)
    }

    current(){
        return this.apiPromise.get(`${this.urlPrefix}/fiscal-periods/current`);
    }

    getAll(){
        return this.apiPromise.get(`${this.urlPrefix}/fiscal-periods`);
    }
}


