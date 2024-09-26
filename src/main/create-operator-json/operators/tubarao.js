'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let tubarao = new Operator(r6operators.tubarao, operatorId.tubarao, "Operation Deep Freeze");

export default tubarao