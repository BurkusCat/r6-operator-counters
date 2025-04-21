'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let deimos = new Operator(r6operators.deimos, operatorId.deimos, "Operation Deadly Omen");

deimos.addCounterNode(operatorId.caviera, counterType.soft, "Deimos DeathMARK can find caviera's location and track her down.");

export default deimos
