"use strict";

export default function (
    subsidiaryLedgerAccountApi,
    detailAccountApi,
    tagApi) {

    subsidiaryLedgerAccountApi.sync();
    detailAccountApi.sync();
    tagApi.sync();

}