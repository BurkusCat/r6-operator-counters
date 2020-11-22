'use strict';

import counterType from '../core/counterTypeEnums';
import operatorId from '../core/operatorIdEnum';
import Operator from '../core/operatorFactory';
import r6operators from "r6operators";

let maestro = new Operator(r6operators.maestro, operatorId.maestro, "Operation Para Bellum");

maestro.addCounterNode(operatorId.iana, counterType.soft, "Maestro's Evil Eyes can destroy Iana's Hologram with its laser, and can detect its lack of heat signature.");
maestro.addCounterNode(operatorId.zero, counterType.soft, "Maestro's Evil Eye can destroy Zero's cameras.");

export default maestro
