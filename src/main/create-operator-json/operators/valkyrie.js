'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let valkyrie = new Operator(r6operators.valkyrie, operatorId.valkyrie, "Operation Dust Line");

export default valkyrie