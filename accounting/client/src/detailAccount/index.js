"use strict";

import accModule from "../acc.module";
import DetailAccountCategoriesController from "./detailAccountCategories";
import DetailAccountCategoryEntry from "./detailAccountCategoryEntry";
import DetailAccountCategoryApi from './detailAccountCategoryApi';


accModule
    .controller('detailAccountCategoriesController', DetailAccountCategoriesController)
    .controller('detailAccountCategoryEntryController', DetailAccountCategoryEntry)
    .service('detailAccountCategoryApi', DetailAccountCategoryApi);