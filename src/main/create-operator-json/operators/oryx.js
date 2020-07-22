'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let oryx = new Operator(r6operators.oryx, operatorId.oryx, "Operation Void Edge");

oryx.addCounterNode(operatorId.montagne, counterType.hard, "Oryx's dash can knock down Montagne, leaving him vulnerable");
oryx.addCounterNode(operatorId.blitz, counterType.hard, "Oryx's dash can knock down Blitz, leaving him vulnerable");


export default oryx