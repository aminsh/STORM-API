"use strict";

import accModule from '../acc.module';

import {notShouldBeZeroBoth, notShouldHaveValueBoth} from './journalLines.validations';
import remainder from './journalLines.filters';
import journalController from './journal.controller';


accModule
    .directive('notShouldBeZeroBoth', notShouldBeZeroBoth)
    .directive('notShouldHaveValueBoth', notShouldHaveValueBoth)

    .filter('remainder', remainder)

    .controller('journalUpdateController', journalController)
;
