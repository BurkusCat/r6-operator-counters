'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let lesion = new Operator(r6operators.lesion, operatorId.lesion, "Operation Blood Orchid");

lesion.addCounterNode(operatorId.blitz, counterType.soft, "Lesion's Gu mines make Blitz unable to sprint.");
lesion.addCounterNode(operatorId.montagne, counterType.soft, "Lesion's Gu mines make Montagne very vulnerable as he is pressured to remove the needle.");
lesion.addCounterNode(operatorId.finka, counterType.soft, "Lesion's Gu mines stop the effects of Finka's Adrenal Surge.");

export default lesion
