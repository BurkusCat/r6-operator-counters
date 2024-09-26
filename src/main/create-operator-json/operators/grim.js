'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let grim = new Operator(r6operators.grim, operatorId.grim, "Operation Brutal Swarm");


export default grim