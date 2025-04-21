'use strict';

import counterType from '../core/counterTypeEnums.js';
import operatorId from '../core/operatorIdEnum.js';
import Operator from '../core/operatorFactory.js';
import r6operators from "r6operators";

let dokkaebi = new Operator(r6operators.dokkaebi, operatorId.dokkaebi, "Operation White Noise");

dokkaebi.addCounterNode(operatorId.maestro, counterType.soft, "Dokkaebi can hack a defender's phone to gain access to the view granted by Maestro's Evil Eye cameras. She cannot fire his cameras, however.");
dokkaebi.addCounterNode(operatorId.echo, counterType.soft, "Dokkaebi can hack a defender's phone to gain access to the view granted by the Yokai cameras.");
dokkaebi.addCounterNode(operatorId.valkyrie, counterType.hard, "Dokkaebi can hack a defender's phone to gain access to Valkyrie's Black Eyes.");
dokkaebi.addCounterNode(operatorId.mozzie, counterType.minor, "Dokkaebi can hack a defender's phone to gain access to drones hacked by Mozzie's Pests. Attackers will not regain movement control of the drones, however.");
dokkaebi.addCounterNode(operatorId.caviera, counterType.minor, "Dokkaebi can use her Logic Bomb to ring Caveria's phone. This will reveal Caveria's position when roaming even if Silent Step is active.");
dokkaebi.addCounterNode(operatorId.skopos, counterType.minor, "Dokkaebi can use her Logic Bomb to ring Skopos phone. This will prevent him from getting control of the Inactive Shell.");

export default dokkaebi
