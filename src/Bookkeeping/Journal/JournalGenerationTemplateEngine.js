import _ from "lodash";
import {inject, injectable} from "inversify";

_.templateSettings.interpolate = /#([\s\S]+?)#/g;

@injectable()
export class JournalGenerationTemplateEngine {

    utils = {
        sum: (list, field) => list.asEnumerable().sum(item => item[field]),
        isEmpty: value => {
            if(!value)
                return false;
            if(typeof value === "string" && value.length === 0)
                return false;
            if(typeof value === "number" && value === 0)
                return false;

            return true;
        }
    };

    handler(template, model) {
        let temp = '';

        template.lines.forEach(item => temp += this.itemHandler(item));

        let input = {...model, ...this.utils};

        const generated = _.template(`{"description": "${template.description}", "date": "${template.date}","journalLines":[${temp}]}`)(input);

        let regex = /\,(?!\s*?[\{\[\"\'\w])/g;
        let correct = generated.replace(regex, '');

        correct = correct
            .replaceAll('"undefined"', 'null')
            .replaceAll('"null"', 'null');

        const parsed = JSON.parse(correct);

        return parsed;
    }

    itemHandler(item) {

        item.type = item.type || 'data';

        if(item.type === 'data')
            return this.dataHandler(item);

        if(item.type === 'loop')
            return this.loopHandler(item);

        if(item.type === 'if')
            return this.ifHandler(item);
    }

    dataHandler(item){
        return `{
            "subsidiaryLedgerAccountId": "${item.subsidiaryLedgerAccountId}", 
            "detailAccountId": "${item.detailAccountId}", 
            "dimension1Id": "${item.dimension1Id}",
            "dimension2Id": "${item.dimension2Id}",
            "dimension3Id": "${item.dimension3Id}",
            "article": "${item.article}",
            "debtor": ${item.debtor},
            "creditor": ${item.creditor},
        },`;
    }

    loopHandler(item){

        return `<% ${item.by}.forEach(function(${item.as}){%> ${this.itemHandler(item.statement)} <%}) %>`
    }

    ifHandler(item) {

        let temp = `<% if(${item.condition}) { %> ${this.itemHandler(item.then)}  `;

        if(item.else) {
            temp += '<% } else { %> ';
            temp +=  ` ${this.itemHandler(item.else)} `;
            temp += '<% } %>';
        }
        else
            temp += '<% } %>';

        return temp;
    }
}