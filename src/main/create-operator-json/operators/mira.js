'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let mira = new Operator(r6operators.mira, operatorId.mira, "Operation Velvet Shell");

export default mira