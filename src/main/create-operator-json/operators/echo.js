'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let echo = new Operator(r6operators.echo, operatorId.echo, "Operation Red Crow");

export default echo
