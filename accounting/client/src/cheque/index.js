"use strict";


import accModule from '../acc.module';

import {WriteChequeController, WriteCheque} from './writeCheque';



accModule
    .controller('writeChequeController', WriteChequeController)
    .factory('writeCheque', WriteCheque)
;
