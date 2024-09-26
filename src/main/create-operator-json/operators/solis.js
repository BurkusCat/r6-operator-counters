'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let solis = new Operator(r6operators.solis, operatorId.solis, "Operation Solar Raid");

export default solis