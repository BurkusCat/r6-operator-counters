'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let striker = new Operator(r6operators.striker, operatorId.striker, "Operation New Blood");

export default striker