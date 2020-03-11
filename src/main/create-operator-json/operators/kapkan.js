'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let kapkan = new Operator(r6operators.kapkan, operatorId.kapkan, "N/A");

kapkan.addCounterNode(operatorId.amaru, counterType.minor, "Amaru cannot shoot Kapkan's Entry Denial Devices when she is grappling to a window. She is guaranteed to be hit by the trap.");

export default kapkan