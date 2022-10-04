'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let pulse = new Operator(r6operators.pulse, operatorId.pulse, "N/A");

pulse.addCounterNode(operatorId.finka, counterType.soft, "Pulse's Heartbeat Sensor will detect Attackers boosted by Finka's Adrenal Surge for twice the amount of time.");
pulse.addCounterNode(operatorId.maverick, counterType.hard, "Pulse's HeartBeat Sensor will detect Maverick when attempting to put holes through walls.");

export default pulse