'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let blitz = new Operator(r6operators.blitz, operatorId.blitz, "N/A");

export default blitz