'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let melusi = new Operator(r6operators.melusi, operatorId.melusi, "Operation Steel Wave");

melusi.addCounterNode(operatorId.blitz, counterType.soft, "Melusi's Banshee can make Blitz a very vulnerable target by slowing his movement dramatically.");
melusi.addCounterNode(operatorId.montagne, counterType.minor, "Melusi's Banshee can make Montagne a more vulnerable target by reducing his movement speed.");

export default melusi
