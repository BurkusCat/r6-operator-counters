'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let oryx = new Operator(r6operators.oryx, operatorId.oryx, "Operation Void Edge");

export default oryx