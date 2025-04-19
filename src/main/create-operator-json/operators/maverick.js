'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let maverick = new Operator(r6operators.maverick, operatorId.maverick, "Operation Grim Sky");

maverick.addCounterNode(operatorId.bandit, counterType.soft, "Maverick's Breaching Torch can make small holes in walls electrified by Bandit's Shock Wire.");
maverick.addCounterNode(operatorId.kaid, counterType.soft, "Maverick's Breaching Torch can make small holes in walls electrified by Kaid's Electroclaws.");
maverick.addCounterNode(operatorId.mute, counterType.soft, "Maverick's Breaching Torch can make small holes in walls affected by Mute's Signal Disruptors. His Breaching Torch does not get disrupted.");
maverick.addCounterNode(operatorId.maestro, counterType.hard, "Maverick's Breaching Torch can destroy Maestro's Evil Eye.");
maverick.addCounterNode(operatorId.mira, counterType.soft, "Maverick's Breaching Torch can be used to drop the glass from Mira's Black Mirror. Altough he is very vulnerable while doing it.");

export default maverick
