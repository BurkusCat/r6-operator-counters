'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let aruni = new Operator(r6operators.aruni, operatorId.aruni, "Operation Neon Dawn");

export default aruni