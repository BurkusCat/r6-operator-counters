'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let thunderbird = new Operator(r6operators.thunderbird, operatorId.thunderbird, "North Star");

export default thunderbird