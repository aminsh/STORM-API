"use strict";

export default class currentService {
    constructor() {
        this.current = {
            fiscalPeriod: null,
            mode: null
        };
    }

    setFiscalPeriod(fiscalPeriodId){
        this.current.fiscalPeriod = fiscalPeriodId == 0 ? null : fiscalPeriodId;
    }

    setMode(mode){
        this.current.mode = mode;
    }

    get(){
        return this.current;
    }
}