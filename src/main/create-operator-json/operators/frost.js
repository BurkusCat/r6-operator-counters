'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let frost = new Operator(r6operators.frost, operatorId.frost, "Operation Black Ice");

frost.addCounterNode(operatorId.finka, counterType.minor, "Frost's Welcome Mat can prevent currently downed attackers getting revived Finka's Adrenal Surge.");
frost.addCounterNode(operatorId.amaru, counterType.hard, "Frost's Welcome Mat cannot be shot by Amaru while she is grappeling into a window.");

export default frost
