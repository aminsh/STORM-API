interface Page<View> {
    data: View[],
    total: number
}

interface Parameters {
    take?: number;

    skip?: number;

    filter: Filter;

    sort: Sort[];
}

interface Filter {
    filters: FilterList[]
}

interface FilterList {
    field: string;
    operator: string;
    value?: string;
}

interface Sort {
    dir?: string;
    field: string
}