'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let gridlock = new Operator(r6operators.gridlock, operatorId.gridlock, "N/A");

gridlock.addCounterNode(operatorId.vigil, counterType.soft, "Gridlock's Trax Stingers can impede Vigil's strong roaming capabilities.");
gridlock.addCounterNode(operatorId.caviera, counterType.soft, "Gridlock's Trax Stingers can impede Caveira's strong roaming capabilities.");
gridlock.addCounterNode(operatorId.oryx, counterType.soft, "Gridlock's Trax Stingers interrupt Oryx's Remah Daashes.");

export default gridlock