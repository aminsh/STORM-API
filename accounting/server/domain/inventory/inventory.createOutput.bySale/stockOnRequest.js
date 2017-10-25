"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    OneStockBase = require('./oneStockBase');

class StockOnRequest extends OneStockBase {

    constructor(branchId, fiscalPeriodId) {

        super(branchId, fiscalPeriodId);
    }

    set(cmd) {
        this.stockId = cmd.stockId;

        const linesGroupedByStock = cmd.lines.asEnumerable()
            .groupBy(
                item => item.stockId,
                item => item,
                (key, items) => ({
                    stockId: key,
                    items: items.toArray()
                }))
            .toArray();

        let outputs = [];

        linesGroupedByStock.forEach(async.result(item => {
            this.stockId = item.stockId;

            const result = await(super.set({sale: cmd.sale, lines: item.items}));
            outputs.push(result);
        }));

       return outputs;
    }
}

module.exports = StockOnRequest;