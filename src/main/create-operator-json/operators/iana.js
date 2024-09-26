'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let iana = new Operator(r6operators.iana, operatorId.iana, "Operation Void Edge");

export default iana