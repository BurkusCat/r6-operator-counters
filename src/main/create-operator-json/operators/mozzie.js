'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let mozzie = new Operator(r6operators.mozzie, operatorId.mozzie, "Operation Burnt Horizon");

mozzie.addCounterNode(operatorId.twitch, counterType.hard, "Mozzie's Pests can hack Twitch's Shock Drone. The hacked drone can still shoot darts.");
mozzie.addCounterNode(operatorId.flores, counterType.hard, "Mozzie's Pests can hack Flores' RCE-RATERO drone. The hacked drone cannot be controlled though.");
mozzie.addCounterNode(operatorId.brava, counterType.hard, "Mozzie's Pests can hack Brava's Kludge drone. The hacked drones can un-hack previously hacked gadgets and hack attacker gadgets.");


export default mozzie