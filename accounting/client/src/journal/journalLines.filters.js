"use strict";

export default function () {
    return (lines) => lines.asEnumerable().sum(item => item.debtor - item.creditor);
}