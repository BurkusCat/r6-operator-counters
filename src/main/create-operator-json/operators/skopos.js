'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let skopos = new Operator(r6operators.skopos, operatorId.skopos, "Operation Twin Shells");

export default skopos
