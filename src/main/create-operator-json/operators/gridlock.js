'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let gridlock = new Operator(r6operators.gridlock, operatorId.gridlock, "N/A");

gridlock.addCounterNode(operatorId.vigil, counterType.soft, "Gridlock's Trax Stingers can impede Vigil's strong roaming capabilities.");
gridlock.addCounterNode(operatorId.caviera, counterType.soft, "Gridlock's Trax Stingers can impede Caveira's strong roaming capabilities.");
gridlock.addCounterNode(operatorId.oryx, counterType.soft, "Gridlock's Trax Stingers interrupt Oryx's Remah Dashes.");

export default gridlock