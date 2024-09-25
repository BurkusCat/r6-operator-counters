'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let clash = new Operator(r6operators.clash, operatorId.clash, "Operation Grim Sky");

clash.addCounterNode(operatorId.montagne, counterType.soft, "Montagne is more susceptible to shocks from Clash's CCE Shield.");

export default clash
