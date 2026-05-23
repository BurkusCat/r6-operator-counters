'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let skopos = new Operator(r6operators.skopos, operatorId.skopos, "Operation Twin Shells");

skopos.addCounterNode(operatorId.jackal, counterType.soft, "Skopos can switch between her V10 Pantheon Shells while being tracked, which will cause further red pings to be located at the now inactive shell.")
skopos.addCounterNode(operatorId.deimos, counterType.soft, "Skopos can switch between her V10 Pantheon Shells while being tracked, which will cause the now inactive shell to be tracked.")
skopos.addCounterNode(operatorId.osa, counterType.soft, "Aruni can destroy Osa's Talon-8 Clear Shield by punching it. This might be risky, as she has to be close to the shield.")
skopos.addCounterNode(operatorId.rauora, counterType.soft, "Aruni can destroy Raoua's DOM Panel by punching it.")

export default skopos
