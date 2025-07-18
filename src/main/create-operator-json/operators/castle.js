'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let castle = new Operator(r6operators.castle, operatorId.castle, "N/A");

castle.addCounterNode(operatorId.amaru, counterType.hard, "Castle's Armor Panels can prevent Amaru's Garra Hook from targeting windows.");
castle.addCounterNode(operatorId.osa, counterType.minor, "Castle's Armor Panels can prevent Osa's Talon Shields from being deployed on doorways and windows.");
castle.addCounterNode(operatorId.rauora, counterType.minor, "Castle's Armor Panels can prevent Rauora's D.O.M Panel from being deployed on doorways and windows.");

export default castle
