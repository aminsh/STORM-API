"use strict";

export default function totalSum(){
    return (data, field) => data.asEnumerable().sum(item => item[field] || 0);
}