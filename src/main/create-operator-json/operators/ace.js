'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let ace = new Operator(r6operators.ace, operatorId.ace, "Operation Steel Wave");

ace.addCounterNode(operatorId.mira, counterType.hard, "Ace's SELMA Breaching Device can destroy Mira's Black Mirror.");

export default ace