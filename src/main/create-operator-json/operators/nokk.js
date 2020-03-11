'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let nokk = new Operator(r6operators.nokk, operatorId.nokk, "Operation Phantom Sight");

nokk.addCounterNode(operatorId.alibi, counterType.hard, "Nøkk's HEL allows her to walk through or attack Alibi's Prismas without triggering their tracking.");
nokk.addCounterNode(operatorId.echo, counterType.soft, "Nøkk's HEL will remove her image from Echo's drones. Echo's drone will show that she is nearby, however.");
nokk.addCounterNode(operatorId.mozzie, counterType.soft, "Nøkk's HEL will remove her image from Mozzie's stolen drones. The hacked drones can still detect when she is nearby, however.");
nokk.addCounterNode(operatorId.valkyrie, counterType.hard, "Nøkk's HEL will remove her image from Valkyrie's Black Eye cameras.");
nokk.addCounterNode(operatorId.maestro, counterType.hard, "Nøkk's HEL will remove her image from Maestro's Evil Eye cameras.");

export default nokk