export  function totalPrice () {
    return (lines) => lines.asEnumerable().sum(item => item.quantity* item.unitPrice);
}

export  function sumTotalPrice () {
    return (lines) => lines.asEnumerable().sum(item => (item.unitPrice *item.quantity)-(item.tax+item.vat+item.discount));
}