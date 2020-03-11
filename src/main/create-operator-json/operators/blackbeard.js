'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let blackbeard = new Operator(r6operators.blackbeard, operatorId.blackbeard, "Operation Dust Line");

export default blackbeard