'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let warden = new Operator(r6operators.warden, operatorId.warden, "Operation Phantom Sight");

warden.addCounterNode(operatorId.ying, counterType.hard, "Warden's smart glasses resist the flashes of Ying's Candelas.");
warden.addCounterNode(operatorId.blitz, counterType.hard, "Warden's smart glasses resist the pop flashes from Blitz's shield.");
warden.addCounterNode(operatorId.glaz, counterType.hard, "Warden's smart glasses can see through smokes and directly counters glaz.");
warden.addCounterNode(operatorId.sens, counterType.hard, "Warden's smart glasses can see through Sens' ROU.");

export default warden
