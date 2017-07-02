"use strict";

import accModule from '../acc.module';
import bankListController from './bankListController';
import bankCreateController from './bankCreateController';
import bankMoreInfoController from './bankMoreInfoController'
import './bankApi';

accModule

    .controller('bankListController',bankListController)
    .controller('bankMoreInfoController',bankMoreInfoController)
    .controller('bankCreateController',bankCreateController);
