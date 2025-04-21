'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let tachanka = new Operator(r6operators.tachanka, operatorId.tachanka, "N/A");

export default tachanka
