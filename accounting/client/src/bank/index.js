"use strict";

import accModule from '../acc.module';
import bankListController from './bankListController';
import bankCreateController from './bankCreateController';
import './bankApi';

accModule

    .controller('bankListController',bankListController)
    .controller('bankCreateController',bankCreateController);
