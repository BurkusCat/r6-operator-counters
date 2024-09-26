'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let brava = new Operator(r6operators.brava, operatorId.brava, "Operation Commanding Force");

export default brava