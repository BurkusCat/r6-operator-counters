'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let sledge = new Operator(r6operators.sledge, operatorId.sledge, "N/A");

sledge.addCounterNode(operatorId.castle, counterType.hard, "Sledge's Breaching Hammer can destroy one of Castle's Armor Panels with a single hit.")
sledge.addCounterNode(operatorId.maestro, counterType.hard, "Sledge's Breaching Hammer can destroy one of Maestro's Evil Eyes with a single hit.");

export default sledge
