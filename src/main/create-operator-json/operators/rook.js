'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let rook = new Operator(r6operators.rook, operatorId.rook, "N/A");

rook.addCounterNode(operatorId.glaz, counterType.minor, "Rook's Armor Plates can mitigate some of Glaz's high ability to deal damage with his OTs-03.");
rook.addCounterNode(operatorId.kali, counterType.minor, "Rook's Armor Plates can mitigate Kali's effectiveness, as her primary weapon needs two hits to the body to down & kill an operator.");

export default rook
