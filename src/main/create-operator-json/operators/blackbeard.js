'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let blackbeard = new Operator(r6operators.blackbeard, operatorId.blackbeard, "Operation Dust Line");

export default blackbeard