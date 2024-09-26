'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let flores = new Operator(r6operators.flores, operatorId.flores, "Crimson Heist");

flores.addCounterNode(operatorId.maestro, counterType.hard, "Flores' RCE-RATERO drone can destroy Maestro's Evil Eye.");
flores.addCounterNode(operatorId.melusi, counterType.hard, "Flores' RCE-RATERO drone can destroy Melusi's Banshee.");
flores.addCounterNode(operatorId.bandit, counterType.hard, "Flores' RCE-RATERO drone can destroy Bandit's Shock Wires.");
flores.addCounterNode(operatorId.kaid, counterType.hard, "Flores' RCE-RATERO drone can destroy Kaid's Electroclaws.");
flores.addCounterNode(operatorId.castle, counterType.hard, "Flores' RCE-RATERO drone can destroy Castle's Armor Panels");
flores.addCounterNode(operatorId.kapkan, counterType.hard, "Flores' RCE-RATERO drone can destroy Kapkan's EDD.");
flores.addCounterNode(operatorId.frost, counterType.hard, "Flores' RCE-RATERO drone can destroy Frost's Welcome Mats.");
flores.addCounterNode(operatorId.rook, counterType.minor, "Flores' RCE-RATERO drone can destroy Rook's Armor Pack.");
flores.addCounterNode(operatorId.thunderbird, counterType.hard, "Flores' RCE-RATERO drone can destroy Thunderbird's Kona Station.");

export default flores