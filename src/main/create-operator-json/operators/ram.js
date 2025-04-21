'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let ram = new Operator(r6operators.ram, operatorId.ram, "Operation Heavy Mettle");

ram.addCounterNode(operatorId.aruni, counterType.hard, "Ram's BU-Gi can temporarily disable Aruni's Surya Gate, while staying intact.");

export default ram
