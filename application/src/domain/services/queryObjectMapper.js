import toResult from "asyncawait/await";
import async from "asyncawait/async";

class QueryObjectMapper {

    init(){
        let knex = instanceOf('knex'),
            tablesData = toResult(knex.select('table_name', 'column_name')
                .from('information_schema.columns')
                .where('table_schema', 'public')),
            tables = tablesData.asEnumerable()
                .groupBy(item => item.table_name, item => item, (key, items)=> ({
                    table: key,
                    columns: items.select(c => c.column_name).toArray()
                }))
                .toObject(item => item.table, item => item.columns);


        this.tables = tables;
    }

    columnsToSelect(tableName){
        let knex = instanceOf('knex'),
            cols = this.tables[tableName];

        return cols.map(col => knex.raw(`"${tableName}"."${col}" as "${tableName}_${col}"`));
    }

    mapResult(result, selector){
        if(!selector) selector = item => item;

        if(Array.isArray(result)){
            return result.asEnumerable()
                .select(row => this._mapResult(row))
                .select(selector)
                .toArray()
        }
        else {
            let data = this._mapResult(result);
            return selector(data);
        }
    }

    _mapResult(row){
        return this._parseRow(row).asEnumerable()
            .groupBy(item => item.name, item => item, (key, items)=> ({group: key, value: items.toObject(item => item.key, item => item.value)}))
            .toObject(item => item.group, item => item.value);
    }

    _parseRow(row) {
        return Object.keys(row).asEnumerable()
            .select(key => {
                let value = row[key],
                    splitedKey = key.split('_');

                return {name: splitedKey[0], key: splitedKey[1], value};
            })
            .toArray();
    }
}

const instance = new QueryObjectMapper();

async(function () {
    instance.init();
})();

export default instance;
