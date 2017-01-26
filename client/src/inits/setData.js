"use strict";

export default function (currentService, $cookies){

    currentService.setFiscalPeriod(parseInt($cookies.get('current-period')));
    currentService.setMode($cookies.get('current-mode'));
    currentService.setBranch(JSON.parse(localStorage.getItem('currentBranch')));
}