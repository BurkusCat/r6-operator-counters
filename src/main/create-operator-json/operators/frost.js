'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let frost = new Operator(r6operators.frost, operatorId.frost, "Operation Black Ice");

frost.addCounterNode(operatorId.finka, counterType.minor, "Attackers downed by Frost's Welcome Mats will not be revived by Finka's Adrenal Surge.");
frost.addCounterNode(operatorId.amaru, counterType.hard, "Amaru cannot shoot Frost's Welcome Mats when she is rappelling to a window. She is guaranteed to be hit by the trap.");

export default frost
