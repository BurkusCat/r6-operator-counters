'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let lion = new Operator(r6operators.lion, operatorId.lion, "Operation Chimera");

export default lion