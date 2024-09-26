'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let ram = new Operator(r6operators.ram, operatorId.ram, "Operation Heavy Mettle");

export default ram