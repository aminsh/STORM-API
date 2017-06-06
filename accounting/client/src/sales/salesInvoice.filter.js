export  function totalPrice () {
    return (lines) => lines.asEnumerable().sum(item => item.quantity* item.unitPrice);
}
export  function sumTotalPrice () {
    return (lines) => lines.asEnumerable().sum(item =>((item.unitPrice * item.quantity)-item.discount) + ((item.unitPrice * item.quantity)-item.discount)*(item.tax/100));
}
export  function sumTotalTaxPrice () {
    return (lines) => lines.asEnumerable().sum(item => ((item.unitPrice * item.quantity)-item.discount)*(item.tax/100));
}