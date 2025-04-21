'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let kapkan = new Operator(r6operators.kapkan, operatorId.kapkan, "N/A");

kapkan.addCounterNode(operatorId.amaru, counterType.minor, "Kapkan's EDDs cannot be shot by Amaru while she is grappeling into a window.");

export default kapkan
