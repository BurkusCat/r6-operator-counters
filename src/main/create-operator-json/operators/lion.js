'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let lion = new Operator(r6operators.lion, operatorId.lion, "Operation Chimera");

export default lion