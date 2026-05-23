'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let blackbeard = new Operator(r6operators.blackbeard, operatorId.blackbeard, "Operation Dust Line/Collision Point");
blackbeard.addCounterNode(operatorId.castle, counterType.hard, "Blackbeard's H.U.L.L. Adaptable Shield can destroy Castle's Armor Panels with his pneumatic charges.");
blackbeard.addCounterNode(operatorId.azami, counterType.hard, "Blackbeard's H.U.L.L. Adaptable Shield can destroy Azami's Kiba Barriers with his pneumatic charges.");

export default blackbeard
