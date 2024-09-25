'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let montagne = new Operator(r6operators.montagne, operatorId.montagne, "N/A");

export default montagne