'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let zero = new Operator(r6operators.zero, operatorId.zero, "Operation Shadow Legacy");

zero.addCounterNode(operatorId.mira, counterType.hard, "Mira's black mirrors can be destroyed by Zero's zap.");
zero.addCounterNode(operatorId.alibi, counterType.hard, "Alibi's prismas can be destroyed by Zero's zap.");
zero.addCounterNode(operatorId.echo, counterType.hard, "Echo's yokai drones can be destroyed by Zero's zap.");
zero.addCounterNode(operatorId.valkyrie, counterType.hard, "Valkyrie's Black Eye cameras can be destroyed by Zero's zap.");
zero.addCounterNode(operatorId.maestro, counterType.hard, "Maestro's Evil eye can be destroyed by Zero's zap.");





export default zero
