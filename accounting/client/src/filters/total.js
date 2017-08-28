"use strict";

export default function totalSum(){

    return (data, field) => {
        if(!data)
            return 0;

        if(field.includes('$'))
            return  data.asEnumerable().sum(field);
        return data.asEnumerable().sum(item => item[field] || 0);
    }
}