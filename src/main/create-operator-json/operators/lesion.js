'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let lesion = new Operator(r6operators.lesion, operatorId.lesion, "Operation Blood Orchid");

lesion.addCounterNode(operatorId.blitz, counterType.soft, "Blitz cannot sprint whenever stuck with a Lesion Gu needle.");
lesion.addCounterNode(operatorId.montagne, counterType.soft, "Montagne can be put in a very vulnerable position when stuck with a Lesion Gu needle.");
lesion.addCounterNode(operatorId.finka, counterType.soft, "Finka's boost is ended whenever stuck with a Lesion Gu needle.");

export default lesion
