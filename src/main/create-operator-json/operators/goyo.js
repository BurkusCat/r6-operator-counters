'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let goyo = new Operator(r6operators.goyo, operatorId.goyo, "Operation Ember Rise");

goyo.addCounterNode(operatorId.montagne, counterType.soft, "Goyo's 4 Volcán Canisters can delay Montagne pushing.");
goyo.addCounterNode(operatorId.blitz, counterType.soft, "Goyo's 4 Volcán Canisters can delay Blitz pushing.");

export default goyo
