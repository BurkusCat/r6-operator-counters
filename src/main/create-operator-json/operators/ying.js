'use strict';
import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";
let ying = new Operator(r6operators.ying, operatorId.ying, "Operation Blood Orchid");

ying.addCounterNode(operatorId.jager, counterType.soft, "Ying has the ability to place her Candela on a breachable surface releasing all 6 Flash Charges. This drains all three ADSs.");

export default ying