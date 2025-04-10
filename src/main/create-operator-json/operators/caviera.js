'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let caviera = new Operator(r6operators.caveira, operatorId.caviera, "Operation Skull Rain");

caviera.addCounterNode(operatorId.jackal, counterType.hard, "When Caveira is using Silent Step, she leaves no footsteps and therefore cannot be scanned by Jackal's Eyenox.")

export default caviera
