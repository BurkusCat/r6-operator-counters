'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let sens = new Operator(r6operators.sens, operatorId.sens, "Operation Vector Glare");

export default sens
