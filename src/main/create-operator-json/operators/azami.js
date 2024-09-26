'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let azami = new Operator(r6operators.azami, operatorId.azami, "Operation Demon Veil");

export default azami