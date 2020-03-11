'use strict';

import counterType from './core/counterTypeEnums';
import operatorId from './core/operatorIdEnum';
import Operator from './core/operatorFactory';
import r6operators from "r6operators";

let hibana = new Operator(r6operators.hibana, operatorId.hibana, "Operation Red Crow");

hibana.addCounterNode(operatorId.castle, counterType.minor, "Hibana's X-KAIROS pellets can destroy Castle's Armor Panel if necessary.");
hibana.addCounterNode(operatorId.mira, counterType.hard, "Hibana's X-KAIROS pellets can destroy Mira's Black Mirror.");

export default hibana