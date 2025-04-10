'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let jackal = new Operator(r6operators.jackal, operatorId.jackal, "Operation Velvet Shell");

export default jackal
