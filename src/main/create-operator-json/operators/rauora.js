'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let rauora = new Operator(r6operators.rauora, operatorId.rauora, "Operation Prep Phase");

rauora.addCounterNode(operatorId.caviera, counterType.soft, "Rauora's D.O.M Panels can impede Caveira's strong roaming capabilities.");

export default rauora
