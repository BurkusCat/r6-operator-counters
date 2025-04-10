'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let skopos = new Operator(r6operators.skopos, operatorId.skopos, "Operation Twin Shells");

skopos.addCounterNode(r6operators.jackal, counterType.soft, "Skopos can switch between her V10 Pantheon Shells while being tracked, which will cause further red pings to be located at the now inactive shell.")

export default skopos
