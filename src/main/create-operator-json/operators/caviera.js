'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let caviera = new Operator(r6operators.caveira, operatorId.caviera, "Operation Skull Rain");

caviera.addCounterNode(operatorId.jackal, counterType.hard, "Caveira's Silent Step makes her leave no footsteps and therefore avoid being scanned by Jackal's Eyenox.")

export default caviera
