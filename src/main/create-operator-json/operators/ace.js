'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let ace = new Operator(r6operators.ace, operatorId.ace, "Operation Steel Wave");

ace.addCounterNode(operatorId.mira, counterType.hard, "Ace's SELMA Breaching Device can destroy Mira's Black Mirror.");

export default ace