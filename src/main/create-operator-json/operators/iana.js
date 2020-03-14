'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let iana = new Operator(r6operators.iana, operatorId.iana, "Operation Void Edge");

export default iana