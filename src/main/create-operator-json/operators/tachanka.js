'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let tachanka = new Operator(r6operators.tachanka, operatorId.tachanka, "N/A");

export default tachanka