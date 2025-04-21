'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let pulse = new Operator(r6operators.pulse, operatorId.pulse, "N/A");

pulse.addCounterNode(operatorId.finka, counterType.soft, "Pulse's Heartbeat Sensor will detect Attackers boosted by Finka's Adrenal Surge from further away.");
pulse.addCounterNode(operatorId.maverick, counterType.hard, "Pulse's Heartbeat Sensor will detect Maverick's Breaching Torch when attempting to put holes in walls.");

export default pulse
