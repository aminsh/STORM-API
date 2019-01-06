import {FindConditions, FindManyOptions, getRepository, ObjectType} from "typeorm";
import {ViewBase} from "../../Product/ProductView";
import {Component} from "../Providers";

@Component()
export class QueryProvider<TView extends ViewBase> {

    async find<TView>(
        viewModel: ObjectType<TView>,
        parameters: Parameters,
        findOptions: FindConditions<TView>): Promise<Page<TView>> {

        const repository = getRepository(viewModel);

        let options: FindManyOptions<TView> = {};

        options.take = parameters.take;
        options.skip = parameters.skip;
        options.where = Object.assign({}, findOptions, this.resolveFilter(parameters.filter));
        options.order = this.resolveSort(parameters.sort);

        const result = await repository.findAndCount(options);

        return {
            data: result[0],
            total: result[1]
        };
    }

    private resolveFilter<View>(filter: Filter): FindConditions<View> {

        let findOptions: FindConditions<View> = {};

        filter.filters.forEach(f => {
            switch (f.operator) {
                case "eq":
                    findOptions[f.field] = f.value;
            }
        });

        return findOptions;
    }

    private resolveSort(sort: Sort[]) {
        let sortOptions = {};
        sort.forEach(s => {
            sortOptions[s.field] = s.dir.toLocaleUpperCase();
        });

        return sortOptions;
    }
}