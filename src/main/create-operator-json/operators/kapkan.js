'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let kapkan = new Operator(r6operators.kapkan, operatorId.kapkan, "N/A");

kapkan.addCounterNode(operatorId.amaru, counterType.minor, "Amaru cannot shoot Kapkan's Entry Denial Devices when she is grappling to a window. She is guaranteed to be hit by the trap.");
kapkan.addCounterNode(operatorId.blackbeard, counterType.minor, "Kapkan's Entry Denial Devices will destroy Blackbeard's shield in one hit.")

export default kapkan