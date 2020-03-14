'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let buck = new Operator(r6operators.buck, operatorId.buck, "Operation Black Ice");

export default buck