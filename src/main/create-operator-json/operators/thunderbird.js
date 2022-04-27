'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let thunderbird = new Operator(r6operators.thunderbird, operatorId.thunderbird, "North Star");

export default thunderbird