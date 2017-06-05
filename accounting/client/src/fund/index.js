"use strict";

import accModule from '../acc.module';
import fundListController from './fundListController';
import fundCreateController from './fundCreateController';
import './fundApi';

accModule

    .controller('fundListController',fundListController)
    .controller('fundCreateController',fundCreateController);
