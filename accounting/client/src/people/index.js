"use strict";

import accModule from '../acc.module';
import peopleListController from './peopleListController';
import peopleCreateController from './peopleCreateController';
import './peopleApi';

accModule

    .controller('peopleListController',peopleListController)
    .controller('peopleCreateController',peopleCreateController);
