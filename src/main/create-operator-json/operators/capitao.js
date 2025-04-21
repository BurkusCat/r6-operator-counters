'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let capitao = new Operator(r6operators.capitao, operatorId.capitao, "Operation Skull Rain");

capitao.addCounterNode(operatorId.capitao, counterType.hard, "Capitão's Tactical Crossbow can fire asphyxiating bolts that can be used to easily take out Clash.");
capitao.addCounterNode(operatorId.mira, counterType.minor, "Capitão's Tactical Crossbow can fire asphyxiating bolts that can be used to safely and easily flush out defenders using Mira's Black Mirrors.");

export default capitao
