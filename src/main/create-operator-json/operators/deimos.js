'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let deimos = new Operator(r6operators.deimos, operatorId.deimos, "Operation Deadly Omen");


export default deimos
